/**
 * Utilidades para el manejo y formato de tiempo
 */

/**
 * Convierte una cadena de fecha/hora en formato ISO a formato de 12 horas (AM/PM)
 * @param {string} iso - Cadena de fecha/hora en formato ISO 8601 (ej: "2023-04-26T14:30:00Z")
 * @returns {string} Hora formateada en sistema de 12 horas (ej: "2:30 PM")
 */
export function toTime12h(iso: string): string {
  try {
    const date = new Date(iso);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return "Hora inválida";
    }

    return date.toLocaleTimeString("es-ES", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error al formatear hora:", error);
    return "Hora inválida";
  }
}
