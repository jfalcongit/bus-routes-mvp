"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

/**
 * Componente Map
 *
 * Renderiza un mapa de Google con marcadores en las paradas especificadas
 * y una línea que conecta dichas paradas para mostrar una ruta.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.stops - Lista de paradas con sus coordenadas y nombres
 */
export default function Map({
  stops,
}: {
  stops: { lat: number; lng: number; name: string }[];
}) {
  // Carga la API de Google Maps
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Muestra un indicador de carga mientras se inicializa el mapa
  if (!isLoaded) return <div className="h-[400px]">Cargando mapa…</div>;

  // Verifica que existan paradas para evitar errores
  if (!stops.length) {
    return <div className="h-[400px]">No hay paradas para mostrar</div>;
  }

  const center = stops[0];
  const path = stops.map(({ lat, lng }) => ({ lat, lng }));

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={center}
      zoom={12}
    >
      <Polyline
        path={path}
        options={{ strokeColor: "#6f32d4", strokeWeight: 4 }}
      />
      {stops.map((s, i) => (
        <Marker key={i} position={{ lat: s.lat, lng: s.lng }} title={s.name} />
      ))}
    </GoogleMap>
  );
}
