"use client";

import RouteCard from "@/components/RouteCard";
import SearchBar from "@/components/SearchBar";
import routeData from "@/data/routes.json";
import { useMemo, useState } from "react";

export default function RoutesPage() {
  const [filter, setFilter] = useState("");

  const routes = useMemo(() => {
    if (!filter) return routeData;
    return routeData.filter((r) =>
      `${r.origin} ${r.destination}`
        .toLowerCase()
        .includes(filter.toLowerCase())
    );
  }, [filter]);

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-brand-purple">
        Rutas disponibles
      </h1>
      <SearchBar onFilter={setFilter} />
      <section className="space-y-4">
        {routes.map((r) => (
          <RouteCard
            key={r.id}
            id={r.id}
            origin={r.origin}
            destination={r.destination}
            fare={r.fare}
            thumb={r.stops[0]}
          />
        ))}
        {routes.length === 0 && (
          <p className="text-slate-400">No hay rutas disponibles.</p>
        )}
      </section>
    </main>
  );
}
