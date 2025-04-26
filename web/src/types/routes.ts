/**
 * Definiciones de tipos para el sistema de rutas de autobuses
 * Este archivo contiene las interfaces que describen la estructura de datos
 * de paradas, viajes y rutas de autobuses.
 */

/**
 * Representa una parada de autobús
 * @property {string} name - Nombre o descripción de la parada
 * @property {number} lat - Latitud de la ubicación geográfica de la parada
 * @property {number} lng - Longitud de la ubicación geográfica de la parada
 */
export interface Stop {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Representa un viaje individual de autobús
 * @property {string} departureTime - Hora de salida en formato ISO
 * @property {string} arrivalTime - Hora de llegada en formato ISO
 */
export interface Trip {
  departureTime: string;
  arrivalTime: string;
}

/**
 * Representa una ruta completa de autobús
 * @property {string} id - Identificador único de la ruta
 * @property {number} fare - Tarifa del viaje en la moneda local
 * @property {number} capacity - Capacidad máxima de pasajeros del autobús
 * @property {Stop[]} stops - Lista de paradas que componen la ruta
 * @property {Trip[]} trips - Horarios de viajes disponibles en esta ruta
 */
export interface Route {
  id: string;
  fare: number;
  capacity: number;
  stops: Stop[];
  trips: Trip[];
}
