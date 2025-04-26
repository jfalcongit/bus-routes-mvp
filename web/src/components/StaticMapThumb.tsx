/**
 * Componente que muestra una miniatura estática de un mapa de Google Maps
 * centrado en las coordenadas especificadas.
 */

import Image from "next/image";

/**
 * Props del componente
 * @property {number} lat - Latitud del punto a mostrar en el mapa
 * @property {number} lng - Longitud del punto a mostrar en el mapa
 */
interface Props {
  lat: number;
  lng: number;
}

/**
 * Renderiza una miniatura de mapa estático de Google Maps
 * @param {Props} props - Propiedades del componente
 */
export default function StaticMapThumb({ lat, lng }: Props) {
  const src = `https://maps.googleapis.com/maps/api/staticmap?size=300x150&zoom=11&scale=2&markers=color:0x6f32d4|${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  return (
    <div className="relative h-[84px] w-[168px] overflow-hidden rounded-md border-2 border-brand-purple-dark">
      <Image
        src={src}
        alt={`Mapa estático en coordenadas ${lat},${lng}`}
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
