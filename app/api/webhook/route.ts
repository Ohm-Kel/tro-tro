import { NextResponse } from "next/server";
import { parseQuery } from "@/lib/nlu";
import { findRoutes } from "@/lib/router";

/**
 * Twilio Webhook Handler for the WhatsApp Bot.
 * Receives URL-encoded form data from Twilio, parses queries using NLU, 
 * computes BFS routes, and returns a formatted TwiML response.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const incomingText = (formData.get("Body") as string) || "";
    
    // Fallback message template helper
    const buildTwiMLResponse = (text: string) => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</Message>
</Response>`;
      return new NextResponse(xml, {
        headers: {
          "Content-Type": "text/xml",
        },
      });
    };

    if (!incomingText.trim()) {
      return buildTwiMLResponse(
        "🚐 *Tro-Tro Router*\n\nPlease type where you are and where you want to go (e.g. *Tech to Adum*)."
      );
    }

    // 1. Parse text using our NLU engine
    const { fromStation, toStation } = await parseQuery(incomingText);

    if (!fromStation || !toStation) {
      let missing = [];
      if (!fromStation) missing.push("starting point");
      if (!toStation) missing.push("destination");

      return buildTwiMLResponse(
        `🚐 *Tro-Tro Router*\n\nSorry, I couldn't identify the *${missing.join(" or ")}* in your query.\n\nTry sending: *From to To* (e.g. _Tech to Adum_ or _Kotei to Kejetia_).`
      );
    }

    // 2. Find route using BFS router
    const options = await findRoutes(fromStation.id, toStation.id);

    if (options.length === 0) {
      return buildTwiMLResponse(
        `🚐 *Tro-Tro Router*\n\nWe couldn't find a tro-tro connection between *${fromStation.name}* and *${toStation.name}*.`
      );
    }

    // 3. Format the best option (the first option)
    const bestOption = options[0];
    let reply = `🚐 *Best Route Found!*\n`;
    reply += `*From:* ${fromStation.name}\n`;
    reply += `*To:* ${toStation.name}\n\n`;
    reply += `*Total Fare:* ₵${bestOption.totalFare.toFixed(2)}\n`;
    reply += `*Stops:* ${bestOption.totalStops} stops (~${bestOption.estimatedMinutes} mins)\n\n`;
    reply += `*Route Steps:*\n`;

    bestOption.segments.forEach((segment, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === bestOption.segments.length - 1;
      const stopCount = segment.stops.length - 1;

      reply += `${isFirst ? "🟢" : "🟡"} *Board:* ${segment.boardAt.stationName}\n`;
      reply += ` └─ Take *${segment.routeName}* (${stopCount} stops)\n`;
      if (segment.vehicleNote) {
        reply += `    _${segment.vehicleNote}_\n`;
      }
      
      if (isLast) {
        reply += `🔴 *Alight:* ${segment.alightAt.stationName}\n`;
      }
    });

    if (bestOption.segments.length > 1) {
      reply += `\n*Fare Breakdown:* ${bestOption.segments
        .map((s) => `₵${s.fare.toFixed(2)}`)
        .join(" + ")}`;
    }

    return buildTwiMLResponse(reply);
  } catch (error: any) {
    console.error("Twilio Webhook error:", error);
    
    // Silent error fallback XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>🚐 *Tro-Tro Router*\n\nAn error occurred while calculating your route. Please try again shortly.</Message>
</Response>`;
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}
