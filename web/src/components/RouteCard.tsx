import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import StaticMapThumb from "./StaticMapThumb";

/**
 * Props para el componente RouteCard
 * @interface Props
 * @property {string} id - Identificador único de la ruta
 * @property {string} origin - Lugar de origen de la ruta
 * @property {string} destination - Lugar de destino de la ruta
 * @property {number} fare - Tarifa de la ruta en Bolivianos
 * @property {Object} thumb - Coordenadas para la miniatura del mapa
 * @property {number} thumb.lat - Latitud para el centro del mapa
 * @property {number} thumb.lng - Longitud para el centro del mapa
 */
interface Props {
  id: string;
  origin: string;
  destination: string;
  fare: number;
  thumb: { lat: number; lng: number };
}

/**
 * Componente que muestra una tarjeta con información resumida de una ruta de bus
 * Incluye origen, destino, tarifa y una miniatura del mapa
 * El diseño se adapta a dispositivos móviles y escritorio
 */
export default function RouteCard({
  id,
  origin,
  destination,
  fare,
  thumb,
}: Props) {
  /**
   * Componente interno que renderiza el título con origen y destino
   * Se reutiliza para evitar duplicación de código
   */
  const RouteTitle = () => (
    <h3 className="text-lg font-semibold">
      {origin} <span className="text-brand-purple">→</span> {destination}
    </h3>
  );

  return (
    <Link
      className="flex flex-col items-center gap-4 rounded-lg border-l-4 border-brand-purple bg-white p-4 text-brand-night shadow hover:shadow-md"
      href={`/routes/${id}`}
    >
      {/* Contenedor principal con diseño responsivo */}
      <div className="flex w-full items-center justify-between gap-4">
        <StaticMapThumb {...thumb} />

        {/* En pantallas medianas/grandes, el título se muestra inline */}
        <div className="hidden md:flex flex-col flex-1">
          <RouteTitle />
        </div>

        <Badge
          className="bg-brand-yellow text-brand-night py-1 px-2 text-sm"
          variant="primary"
        >
          {fare.toFixed(2)} Bs
        </Badge>
      </div>

      {/* En móviles, el título se muestra debajo del mapa */}
      <div className="flex md:hidden flex-col flex-1 w-full">
        <RouteTitle />
      </div>
    </Link>
  );
}
