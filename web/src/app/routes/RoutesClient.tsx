"use client";

import RouteCard from "@/components/RouteCard";
import SearchBar from "@/components/SearchBar";
import { Route } from "@/types/routes";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";

/**
 * Elimina acentos y caracteres diacríticos de una cadena de texto
 * @param str - Texto a normalizar
 * @return Texto sin acentos ni caracteres diacríticos
 */
function stripAccents(str: string): string {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

interface RoutesClientProps {
  initialRoutes: Route[];
}

/**
 * Componente cliente para visualizar y filtrar rutas de autobús
 * @param initialRoutes - Lista inicial de rutas a mostrar
 */
export default function RoutesClient({ initialRoutes }: RoutesClientProps) {
  // Estado para almacenar el texto de búsqueda/filtro
  const [filter, setFilter] = useState("");

  // Filtra las rutas según el término de búsqueda
  const routes = useMemo(() => {
    const term = stripAccents(filter.trim()).toLowerCase();
    // Si no hay término de búsqueda, muestra todas las rutas
    if (!term) return initialRoutes;

    // Tipo extendido para incluir versiones normalizadas de origen y destino
    type IndexedRoute = Route & {
      originNorm: string;
      destinationNorm: string;
    };

    // Preprocesa las rutas para búsqueda, normalizando los nombres
    const indexed: IndexedRoute[] = initialRoutes.map((r) => ({
      ...r,
      originNorm: stripAccents(r.stops[0]?.name ?? "").toLowerCase(),
      destinationNorm: stripAccents(
        r.stops[r.stops.length - 1]?.name ?? ""
      ).toLowerCase(),
    }));

    // Configuración de búsqueda fuzzy con Fuse.js
    const fuse = new Fuse<IndexedRoute>(indexed, {
      keys: ["originNorm", "destinationNorm"],
      threshold: 0.3,
      ignoreLocation: true,
    });

    // Devuelve los resultados filtrados
    return fuse.search(term).map((res) => res.item);
  }, [filter, initialRoutes]);

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-brand-purple">
        Rutas disponibles
      </h1>

      {/* Barra de búsqueda para filtrar rutas */}
      <SearchBar filter={filter} onFilter={setFilter} />

      {/* Lista de rutas filtradas */}
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
