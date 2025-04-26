import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente de carga para la página de detalles de ruta
 *
 * Este componente se muestra automáticamente mientras Next.js está cargando
 * los datos de la ruta específica. Utiliza elementos Skeleton para proporcionar
 * una representación visual de la estructura de la página durante la carga.
 */
export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Esqueleto para el título */}
      <Skeleton className="h-8 my-6 w-1/3" />
      {/* Esqueleto para la información principal */}
      <Skeleton className="h-12 my-6" />
      {/* Esqueletos para elementos de contenido */}
      <Skeleton className="h-24 my-6" />
      <Skeleton className="h-24 my-6" />
      <Skeleton className="h-24 my-6" />
    </div>
  );
}
