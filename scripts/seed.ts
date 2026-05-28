import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

async function seed() {
  console.log("Starting database seed...");

  // 1. Read seed data files
  const stationsPath = path.resolve(process.cwd(), "data/stations.json");
  const routesPath = path.resolve(process.cwd(), "data/routes.json");
  const routeStopsPath = path.resolve(process.cwd(), "data/route_stops.json");

  const stations = JSON.parse(fs.readFileSync(stationsPath, "utf8"));
  const routes = JSON.parse(fs.readFileSync(routesPath, "utf8"));
  const routeStops = JSON.parse(fs.readFileSync(routeStopsPath, "utf8"));

  // 2. Clear existing data in reverse dependency order
  console.log("Clearing old route stops...");
  const { error: clearStopsError } = await supabase.from("route_stops").delete().neq("route_id", "");
  if (clearStopsError) {
    console.error("Error clearing route stops:", clearStopsError);
    process.exit(1);
  }

  console.log("Clearing old routes...");
  const { error: clearRoutesError } = await supabase.from("routes").delete().neq("id", "");
  if (clearRoutesError) {
    console.error("Error clearing routes:", clearRoutesError);
    process.exit(1);
  }

  console.log("Clearing old stations...");
  const { error: clearStationsError } = await supabase.from("stations").delete().neq("id", "");
  if (clearStationsError) {
    console.error("Error clearing stations:", clearStationsError);
    process.exit(1);
  }

  // 3. Insert stations
  console.log(`Inserting ${stations.length} stations...`);
  const { error: stationsError } = await supabase.from("stations").insert(stations);
  if (stationsError) {
    console.error("Error inserting stations:", stationsError);
    process.exit(1);
  }

  // 4. Insert routes
  console.log(`Inserting ${routes.length} routes...`);
  const formattedRoutes = routes.map((r: any) => ({
    id: r.id,
    name: r.name,
    color: r.color,
    vehicle_note: r.vehicle_note,
    bidirectional: r.bidirectional,
  }));
  const { error: routesError } = await supabase.from("routes").insert(formattedRoutes);
  if (routesError) {
    console.error("Error inserting routes:", routesError);
    process.exit(1);
  }

  // 5. Insert route stops
  console.log(`Inserting ${routeStops.length} route stops...`);
  const formattedStops = routeStops.map((s: any) => ({
    route_id: s.routeId,
    station_id: s.stationId,
    sequence: s.sequence,
    fare_from_start: s.fareFromStart,
  }));
  const { error: stopsError } = await supabase.from("route_stops").insert(formattedStops);
  if (stopsError) {
    console.error("Error inserting route stops:", stopsError);
    process.exit(1);
  }

  console.log("Database seeded successfully!");
}

seed().catch((err) => {
  console.error("Fatal seeding error:", err);
  process.exit(1);
});
