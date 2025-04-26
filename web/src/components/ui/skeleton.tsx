import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * Componente Skeleton (Esqueleto)
 *
 * Se utiliza como un contenedor visual de carga o placeholder mientras
 * el contenido real está siendo cargado. Muestra una animación pulsante
 * para indicar al usuario que hay contenido en proceso de carga.
 *
 * @example
 * ```tsx
 * // Esqueleto básico con altura predeterminada
 * <Skeleton />
 *
 * // Esqueleto personalizado con clases adicionales
 * <Skeleton className="h-12 w-full" />
 * ```
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-300", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
