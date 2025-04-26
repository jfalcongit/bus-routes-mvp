/**
 * Componente de carga para la sección de rutas
 *
 * Este componente muestra un estado de carga utilizando elementos esqueleto
 * mientras se cargan los datos de las rutas.
 */
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Esqueleto para el título */}
      <Skeleton className="h-8 my-6 w-1/3" />
      {/* Esqueleto para la barra de búsqueda o filtro */}
      <Skeleton className="h-12 my-6" />
      {/* Esqueletos para los elementos de la lista de rutas */}
      <Skeleton className="h-24 my-6" />
      <Skeleton className="h-24 my-6" />
      <Skeleton className="h-24 my-6" />
    </div>
  );
}
