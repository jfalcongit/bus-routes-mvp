/**
 * Utilidades generales para la aplicación
 * Este módulo contiene funciones auxiliares utilizadas en múltiples componentes
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina y resuelve conflictos entre clases CSS de Tailwind
 *
 * Esta función utiliza clsx para combinar múltiples valores de clase y
 * tailwind-merge para resolver conflictos entre clases de Tailwind CSS.
 *
 * @example
 * // Uso básico
 * cn("text-red-500", "bg-blue-200")
 * // Con condiciones
 * cn("rounded-md", isActive && "bg-blue-500", !isActive && "bg-gray-200")
 *
 * @param {...ClassValue[]} inputs - Lista de valores de clase a combinar
 * @returns {string} - String con las clases CSS combinadas y optimizadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
