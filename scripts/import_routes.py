#!/usr/bin/env python3
import os
import json
import psycopg2
from psycopg2.extras import DictCursor

# --- CONFIGURE YOUR DATABASE URL HERE (or via $DATABASE_URL env var) ---
DB_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/yourdb")

def ensure_schema(cur):
    schema = """
    CREATE TABLE IF NOT EXISTS stops (
      id           SERIAL PRIMARY KEY,
      name         TEXT    NOT NULL UNIQUE,
      latitude     DOUBLE PRECISION NOT NULL,
      longitude    DOUBLE PRECISION NOT NULL
    );

    CREATE TABLE IF NOT EXISTS routes (
      id                    TEXT PRIMARY KEY,
      origin_stop_id        INTEGER NOT NULL
                               REFERENCES stops(id),
      destination_stop_id   INTEGER NOT NULL
                               REFERENCES stops(id),
      fare                  INTEGER NOT NULL,
      capacity              INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS route_stops (
      route_id    TEXT    NOT NULL
                   REFERENCES routes(id)
                   ON DELETE CASCADE,
      stop_order  INTEGER NOT NULL,
      stop_id     INTEGER NOT NULL
                   REFERENCES stops(id),
      PRIMARY KEY (route_id, stop_order)
    );

    CREATE TABLE IF NOT EXISTS trips (
      id               SERIAL PRIMARY KEY,
      route_id         TEXT       NOT NULL
                           REFERENCES routes(id)
                           ON DELETE CASCADE,
      departure_time   TIMESTAMP WITH TIME ZONE NOT NULL,
      arrival_time     TIMESTAMP WITH TIME ZONE NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_trips_route_time ON trips(route_id, departure_time);
    CREATE INDEX IF NOT EXISTS idx_route_stops_stop    ON route_stops(stop_id);
    """
    cur.execute(schema)

def get_connection():
    return psycopg2.connect(DB_URL, cursor_factory=DictCursor)

def upsert_stop(cur, name, lat, lng):
    cur.execute("""
        INSERT INTO stops (name, latitude, longitude)
        VALUES (%s, %s, %s)
        ON CONFLICT (name) DO NOTHING
        RETURNING id
    """, (name, lat, lng))
    row = cur.fetchone()
    if row:
        return row["id"]
    # if no RETURNING (conflict), select the existing one
    cur.execute("SELECT id FROM stops WHERE name = %s", (name,))
    return cur.fetchone()["id"]

def main():

    # Load the JSON
    with open("routes.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    conn = get_connection()
    cur = conn.cursor()

    # ensure tables exist
    ensure_schema(cur)
    conn.commit()
    
    for route in data:
        route_id = route["id"]

        # 1) Upsert all stops, collect their IDs
        stop_ids = []
        for s in route["stops"]:
            sid = upsert_stop(cur, s["name"], s["lat"], s["lng"])
            stop_ids.append(sid)

        # Derive origin/destination from first/last stop
        origin_id = stop_ids[0]
        destination_id = stop_ids[-1]

        # 2) Insert the route
        cur.execute("""
            INSERT INTO routes (id, origin_stop_id, destination_stop_id, fare, capacity)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, (
            route_id,
            origin_id,
            destination_id,
            route["fare"],
            route["capacity"],
        ))

        # 3) Insert the ordered route_stops
        for idx, sid in enumerate(stop_ids, start=1):
            cur.execute("""
                INSERT INTO route_stops (route_id, stop_order, stop_id)
                VALUES (%s, %s, %s)
                ON CONFLICT (route_id, stop_order) DO NOTHING
            """, (route_id, idx, sid))

        # 4) Insert each departure/arrival as a trip
        for dep, arr in zip(route["departures"], route["arrivals"]):
            cur.execute("""
                INSERT INTO trips (route_id, departure_time, arrival_time)
                VALUES (%s, %s, %s)
            """, (route_id, dep, arr))

    # Commit everything and clean up
    conn.commit()
    cur.close()
    conn.close()
    print("Import complete.")

if __name__ == "__main__":
    main()
