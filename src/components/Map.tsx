"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

export default function Map({
  stops,
}: {
  stops: { lat: number; lng: number; name: string }[];
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <div className="h-[400px]">Loading map…</div>;

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
