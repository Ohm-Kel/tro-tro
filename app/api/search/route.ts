import { NextResponse } from "next/server";
import { parseQuery } from "@/lib/nlu";
import { findRoutes } from "@/lib/router";
import { getStationByName, getStationMap } from "@/lib/cache";
import type { SearchRequest, SearchResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body: SearchRequest = await request.json();
    const { fromId, toId, fromName, toName, text } = body;

    let resolvedFromId = fromId;
    let resolvedToId = toId;
    let fromStation = null;
    let toStation = null;
    let parseMethod: SearchResponse["parseMethod"] = "direct";

    const stationMap = await getStationMap();

    // 1. Direct search by IDs
    if (resolvedFromId && resolvedToId) {
      fromStation = stationMap.get(resolvedFromId) || null;
      toStation = stationMap.get(resolvedToId) || null;
      parseMethod = "direct";
    }
    // 2. Direct search by Names
    else if (fromName && toName) {
      fromStation = await getStationByName(fromName);
      toStation = await getStationByName(toName);
      resolvedFromId = fromStation?.id;
      resolvedToId = toStation?.id;
      parseMethod = "exact";
    }
    // 3. Natural Language Search
    else if (text) {
      const nluResult = await parseQuery(text);
      fromStation = nluResult.fromStation;
      toStation = nluResult.toStation;
      resolvedFromId = fromStation?.id;
      resolvedToId = toStation?.id;
      parseMethod = nluResult.parseMethod;
    } else {
      return NextResponse.json(
        { error: "Invalid search parameters. Provide fromId/toId, fromName/toName, or text." },
        { status: 400 }
      );
    }

    // Handle station resolution failures
    if (!fromStation || !toStation) {
      let missing = [];
      if (!fromStation) missing.push("starting point");
      if (!toStation) missing.push("destination");
      
      const errorMsg = text 
        ? `We couldn't identify the ${missing.join(" or ")} in your query. Try typing station names directly.`
        : `Could not find station: ${!fromStation ? fromName || "From" : ""} ${!toStation ? toName || "To" : ""}`.trim();
        
      return NextResponse.json<SearchResponse>({
        options: [],
        fromStation,
        toStation,
        parseMethod,
        error: errorMsg,
      });
    }

    // 4. Find routes using BFS
    const options = await findRoutes(fromStation.id, toStation.id);

    return NextResponse.json<SearchResponse>({
      options,
      fromStation,
      toStation,
      parseMethod,
    });
  } catch (error: any) {
    console.error("Search API handler error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
