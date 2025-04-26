"use client";

import Map from "@/components/Map";
import { TimeTag } from "@/components/TimeTag";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route as RouteType } from "@/types/routes";
import Link from "next/link";

interface Props {
  route: RouteType;
}

export default function RouteDetailClient({ route }: Props) {
  const origin = route.stops[0]?.name ?? "Desconocido";
  const destination =
    route.stops[route.stops.length - 1]?.name ?? "Desconocido";

  return (
    <main className="w-full max-w-4xl mx-auto space-y-6 px-4 py-10">
      <Link
        href="/routes"
        className="text-sm text-brand-purple hover:underline"
      >
        ← Regresar al listado de rutas
      </Link>

      <h1 className="text-3xl font-bold text-brand-purple">
        {origin} → {destination}
      </h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Detalles</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <dl className="grid grid-cols-2 gap-4 text-brand-night">
            <div>
              <dt className="font-semibold text-brand-purple">Tarifa</dt>
              <dd>{route.fare.toFixed(2)} Bs</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-purple">Capacidad</dt>
              <dd>{route.capacity} asientos</dd>
            </div>
            <div className="col-span-2">
              <dt className="mb-1 font-semibold text-brand-purple">
                Horas: Salida / Llegada
              </dt>
              <ul className="space-y-1">
                {route.trips.map((t, i) => (
                  <li key={i}>
                    <TimeTag iso={t.departureTime} /> →{" "}
                    <TimeTag iso={t.arrivalTime} />
                  </li>
                ))}
              </ul>
            </div>
          </dl>
        </TabsContent>

        <TabsContent value="map" className="pt-4">
          <Map stops={route.stops} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
