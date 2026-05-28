-- ============================================
-- STATIONS
-- ============================================
create table public.stations (
  id text primary key,
  name text not null,
  aliases text[] default '{}',   -- ["Tech", "KNUST", "University"]
  lat float8 not null,
  lng float8 not null,
  city text not null default 'Kumasi'
);

-- ============================================
-- ROUTES
-- ============================================
create table public.routes (
  id text primary key,
  name text not null,
  color text default '#f59e0b',
  vehicle_note text,
  bidirectional boolean default true   -- false for ring/one-way routes
);

-- ============================================
-- ROUTE_STOPS (ordered, with cumulative fares)
-- ============================================
create table public.route_stops (
  route_id text not null references public.routes(id) on delete cascade,
  station_id text not null references public.stations(id) on delete cascade,
  sequence int not null,
  fare_from_start numeric(10,2) default 0,
  primary key (route_id, sequence),
  unique (route_id, station_id)       -- prevent duplicate station on same route
);

create index idx_route_stops_station on public.route_stops(station_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.stations enable row level security;
alter table public.routes enable row level security;
alter table public.route_stops enable row level security;

-- Public read-only access (anon key can SELECT but not INSERT/UPDATE/DELETE)
create policy "Public read stations" on public.stations for select using (true);
create policy "Public read routes" on public.routes for select using (true);
create policy "Public read route_stops" on public.route_stops for select using (true);
