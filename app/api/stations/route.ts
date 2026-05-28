import { NextResponse } from "next/server";
import { searchStationsLocal } from "@/lib/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ stations: [] });
    }

    const stations = await searchStationsLocal(query);

    // Apply 5-minute cache header (max-age=300) for browser-level autocompleting optimization
    return NextResponse.json(
      { stations },
      {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error: any) {
    console.error("Stations autocomplete API handler error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
