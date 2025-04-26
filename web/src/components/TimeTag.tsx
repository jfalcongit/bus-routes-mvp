/**
 * Componente que muestra una hora formateada a partir de una cadena ISO
 * Convierte tiempo en formato ISO a formato de 12 horas (AM/PM)
 */

import { toTime12h } from "@/lib/time";

/**
 * Props del componente TimeTag
 * @property {string} iso - Cadena de fecha/hora en formato ISO 8601
 */
interface TimeTagProps {
  iso: string;
}

/**
 * Componente TimeTag que muestra una hora en formato de 12 horas
 * @param {TimeTagProps} props - Las propiedades del componente
 */
export function TimeTag({ iso }: TimeTagProps) {
  return <span className="font-mono text-sm">{toTime12h(iso)}</span>;
}
