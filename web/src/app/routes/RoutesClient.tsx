"use client";

import RouteCard from "@/components/RouteCard";
import SearchBar from "@/components/SearchBar";
import { Route } from "@/types/routes";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";

function stripAccents(str: string): string {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

interface RoutesClientProps {
  initialRoutes: Route[];
}

export default function RoutesClient({ initialRoutes }: RoutesClientProps) {
  const [filter, setFilter] = useState("");

  const routes = useMemo(() => {
    const term = stripAccents(filter.trim()).toLowerCase();
    if (!term) return initialRoutes;

    type IndexedRoute = Route & {
      originNorm: string;
      destinationNorm: string;
    };

    const indexed: IndexedRoute[] = initialRoutes.map((r) => ({
      ...r,
      originNorm: stripAccents(r.stops[0]?.name ?? "").toLowerCase(),
      destinationNorm: stripAccents(
        r.stops[r.stops.length - 1]?.name ?? ""
      ).toLowerCase(),
    }));

    const fuse = new Fuse<IndexedRoute>(indexed, {
      keys: ["originNorm", "destinationNorm"],
      threshold: 0.3,
      ignoreLocation: true,
    });

    return fuse.search(term).map((res) => res.item);
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
