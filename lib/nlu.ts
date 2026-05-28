import { Anthropic } from "@anthropic-ai/sdk";
import { getStations, getStationByName } from "./cache";
import type { Station } from "./types";

// In-memory timestamps array to enforce rate limiting on Claude calls
const claudeCallsTimestamps: number[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Clean up older timestamps
  while (claudeCallsTimestamps.length > 0 && claudeCallsTimestamps[0] < oneMinuteAgo) {
    claudeCallsTimestamps.shift();
  }
  
  if (claudeCallsTimestamps.length >= 10) {
    return false; // Limit reached (max 10 calls per minute)
  }
  
  claudeCallsTimestamps.push(now);
  return true;
}

/**
 * Levenshtein distance to support fuzzy matching (Tier 2)
 */
function getLevenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const d: number[][] = [];

  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return d[m][n];
}

/**
 * Looks for exact or fuzzy matches (Tier 1 & Tier 2) for a given phrase.
 */
async function resolveStationLocally(phrase: string): Promise<Station | null> {
  const cleaned = phrase.trim().toLowerCase();
  if (!cleaned) return null;

  // Tier 1: Exact name or alias match
  const exactMatch = await getStationByName(cleaned);
  if (exactMatch) return exactMatch;

  // Tier 2: Fuzzy matching (Levenshtein distance <= 2)
  const stations = await getStations();
  let bestMatch: Station | null = null;
  let minDistance = Infinity;

  for (const station of stations) {
    // Check station name
    const nameDist = getLevenshteinDistance(cleaned, station.name.toLowerCase());
    if (nameDist < minDistance) {
      minDistance = nameDist;
      bestMatch = station;
    }

    // Check station aliases
    for (const alias of station.aliases) {
      const aliasDist = getLevenshteinDistance(cleaned, alias.toLowerCase());
      if (aliasDist < minDistance) {
        minDistance = aliasDist;
        bestMatch = station;
      }
    }
  }

  // Reject fuzzy matches that are too distant
  if (minDistance <= 2) {
    return bestMatch;
  }

  return null;
}

/**
 * Regular expressions to extract origin/destination patterns from common inputs.
 */
const patterns = [
  /from\s+(.+?)\s+to\s+(.+)/i,
  /get\s+from\s+(.+?)\s+to\s+(.+)/i,
  /take\s+me\s+from\s+(.+?)\s+to\s+(.+)/i,
  /at\s+(.+?)\s+going\s+to\s+(.+)/i,
  /(.+?)\s+to\s+(.+)/i, // standard "A to B"
  /(.+?)\s*->\s*(.+)/i,
];

interface ParseResult {
  fromStation: Station | null;
  toStation: Station | null;
  parseMethod: "exact" | "fuzzy" | "claude" | "direct";
}

/**
 * Three-tier NLU engine to parse natural language queries into origin/destination stations.
 */
export async function parseQuery(text: string): Promise<ParseResult> {
  const cleanedText = text.trim();

  // Try regex patterns for local extraction
  let matchedFrom: string | null = null;
  let matchedTo: string | null = null;

  for (const pattern of patterns) {
    const match = cleanedText.match(pattern);
    if (match) {
      matchedFrom = match[1];
      matchedTo = match[2];
      break;
    }
  }

  // If regex matched, try to resolve locally
  if (matchedFrom && matchedTo) {
    const fromStation = await resolveStationLocally(matchedFrom);
    const toStation = await resolveStationLocally(matchedTo);

    if (fromStation && toStation) {
      // Determine if it was exact or fuzzy
      const isExact =
        fromStation.name.toLowerCase() === matchedFrom.toLowerCase().trim() ||
        fromStation.aliases.some((a) => a.toLowerCase() === matchedFrom!.toLowerCase().trim());
      
      const isExactTo =
        toStation.name.toLowerCase() === matchedTo.toLowerCase().trim() ||
        toStation.aliases.some((a) => a.toLowerCase() === matchedTo!.toLowerCase().trim());

      return {
        fromStation,
        toStation,
        parseMethod: isExact && isExactTo ? "exact" : "fuzzy",
      };
    }
  }

  // Tier 3: Claude Haiku Fallback
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("Claude NLU requested but ANTHROPIC_API_KEY is not set.");
    return { fromStation: null, toStation: null, parseMethod: "direct" };
  }

  if (!checkRateLimit()) {
    console.warn("Claude NLU rate limit reached. Falling back to local resolution.");
    return { fromStation: null, toStation: null, parseMethod: "direct" };
  }

  try {
    const stations = await getStations();
    const stationSpecs = stations
      .map((s) => `- Canonical: "${s.name}", Aliases: ${JSON.stringify(s.aliases)}`)
      .join("\n");

    const anthropic = new Anthropic({ apiKey });
    
    const systemPrompt = `You parse tro-tro route queries in Kumasi, Ghana. Extract the origin and destination.

Known stations and their aliases:
${stationSpecs}

Rules:
1. Return ONLY valid JSON: {"from": "exact station name", "to": "exact station name"}
2. Match user input to the CLOSEST known station. Use the canonical name, not the alias.
3. If you cannot determine a field, use null.
4. Handle Twi, Pidgin, and informal English.
5. If the user mentions a landmark, match to the nearest station.
6. Do NOT return any explanation or other text. Just the JSON object.

Examples:
- "Tech to Adum" → {"from": "Tech Junction", "to": "Adum"}
- "I dey KNUST, I wan go Kejetia" → {"from": "Tech Junction", "to": "Kejetia"}
- "from the hospital to the market" → {"from": "KATH", "to": "Kejetia"}`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: "user", content: cleanedText }],
    });

    const responseText = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(responseText.trim());

    const fromStation = parsed.from ? await getStationByName(parsed.from) : null;
    const toStation = parsed.to ? await getStationByName(parsed.to) : null;

    return {
      fromStation,
      toStation,
      parseMethod: "claude",
    };
  } catch (err) {
    console.error("Claude NLU parsing failed:", err);
    return { fromStation: null, toStation: null, parseMethod: "direct" };
  }
}
