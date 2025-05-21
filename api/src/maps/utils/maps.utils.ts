/**
 * Calcula la distancia Haversine entre dos puntos.
 * @param a - Primer punto { lat, lng }
 * @param b - Segundo punto { lat, lng }
 * @returns Distancia en metros.
 */
export function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const toRad = (d: number) => (d * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1Rad = toRad(a.lat);
  const lat2Rad = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Muestrea puntos a lo largo de una polilínea a intervalos regulares de distancia.
 * @param polyline - Array de puntos { lat, lng }.
 * @param intervalMeters - Distancia deseada entre muestras en metros.
 * @returns Array de puntos { lat, lng } muestreados. Incluye el punto inicial.
 */
export function samplePointsAlongPolyline(
  polyline: { lat: number; lng: number }[],
  intervalMeters: number,
): { lat: number; lng: number }[] {
  // Verificación de polilínea válida
  if (!polyline || polyline.length < 2) {
    // Polilínea no válida o demasiado corta
    return polyline.length > 0 ? [polyline[0]] : [];
  }

  const sampledPoints: { lat: number; lng: number }[] = [polyline[0]]; // Incluir siempre el punto inicial
  let distanceAccumulator = 0;
  let lastSampledPoint = polyline[0];

  // Procesar cada segmento de la polilínea
  for (let i = 1; i < polyline.length; i++) {
    let segmentStart = { ...polyline[i - 1] }; // Usar copia para evitar problemas de mutación
    const segmentEnd = polyline[i];
    let segmentDistance = haversine(segmentStart, segmentEnd);

    // Agregar puntos dentro del segmento si es necesario
    while (distanceAccumulator + segmentDistance >= intervalMeters) {
      const remainingDistanceToInterval = intervalMeters - distanceAccumulator;
      const fraction =
        segmentDistance === 0
          ? 0
          : remainingDistanceToInterval / segmentDistance; // Evitar división por cero

      // Interpolación lineal para lat/lng
      const sampleLat =
        segmentStart.lat + (segmentEnd.lat - segmentStart.lat) * fraction;
      const sampleLng =
        segmentStart.lng + (segmentEnd.lng - segmentStart.lng) * fraction;
      const newSamplePoint = { lat: sampleLat, lng: sampleLng };

      // Añadir punto si está suficientemente lejos del último
      if (haversine(lastSampledPoint, newSamplePoint) > intervalMeters * 0.1) {
        sampledPoints.push(newSamplePoint);
        lastSampledPoint = newSamplePoint;
      }

      // Actualizar estado para el siguiente punto potencial en el mismo segmento
      segmentDistance -= remainingDistanceToInterval;
      distanceAccumulator = 0;
      segmentStart = { ...newSamplePoint };
    }

    // Añadir la distancia restante del segmento
    distanceAccumulator += segmentDistance;
  }

  return sampledPoints;
}
