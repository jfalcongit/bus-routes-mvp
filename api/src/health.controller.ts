// src/health.controller.ts
import { Controller, Get } from '@nestjs/common';

/**
 * Controlador para verificar el estado de salud de la API.
 * Proporciona un endpoint simple para monitoreo y comprobación de disponibilidad.
 */
@Controller('health')
export class HealthController {
  /**
   * Verifica el estado de la API y devuelve un resultado básico.
   * @returns Objeto con estado de la API
   */
  @Get()
  check() {
    return { status: 'ok' };
  }
}
