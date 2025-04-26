// src/app/routes/RoutesClient.tsx
"use client";

import RouteCard from "@/components/RouteCard";
import SearchBar from "@/components/SearchBar";
import { Route } from "@/types/routes";
import { useMemo, useState } from "react";

interface RoutesClientProps {
  initialRoutes: Route[];
}

export default function RoutesClient({ initialRoutes }: RoutesClientProps) {
  const [filter, setFilter] = useState("");

  const routes = useMemo(() => {
    if (!filter) return initialRoutes;
    return initialRoutes.filter((r) => {
      const origin = r.stops[0]?.name.toLowerCase();
      const destination = r.stops[r.stops.length - 1]?.name.toLowerCase();
      return (
        origin.includes(filter.toLowerCase()) ||
        destination.includes(filter.toLowerCase())
      );
    });
  }, [filter, initialRoutes]);

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-brand-purple">
        Rutas disponibles
      </h1>

      <SearchBar filter={filter} onFilter={setFilter} />

      <section className="space-y-4">
        {routes.length > 0 ? (
          routes.map((r) => (
            <RouteCard
              key={r.id}
              id={r.id}
              origin={r.stops[0]?.name || "Origen desconocido"}
              destination={
                r.stops[r.stops.length - 1]?.name || "Destino desconocido"
              }
              fare={r.fare}
              thumb={r.stops[0]}
            />
          ))
        ) : (
          <p className="text-slate-400">No hay rutas disponibles.</p>
        )}
      </section>
    </main>
  );
}
