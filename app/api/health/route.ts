import { NextResponse } from "next/server";
import { initCache, getStations, getRoutes, isReady } from "@/lib/cache";

export async function GET() {
  try {
    // Force cache warm-up on health check
    await initCache();

    const stations = await getStations();
    const routes = await getRoutes();

    return NextResponse.json({
      status: "ok",
      cache: {
        loaded: isReady(),
        stationsCount: stations.length,
        routesCount: routes.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Health check failure:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Cache failed to warm up.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
