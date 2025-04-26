import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

/**
 * Función principal para iniciar la aplicación NestJS.
 * Configura el entorno de la API y lanza el servidor HTTP.
 */
async function bootstrap() {
  // Crear la instancia de la aplicación NestJS con buffer de logs habilitado
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Configurar el logger basado en Pino para mejor rendimiento y formato
  app.useLogger(app.get(Logger));

  // Configurar validación global para todas las rutas
  // - whitelist: elimina propiedades que no estén definidas en los DTOs
  // - forbidNonWhitelisted: rechaza peticiones con propiedades no permitidas
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Iniciar el servidor en el puerto especificado o 3000 por defecto
  await app.listen(process.env.PORT ?? 3000);
}

// Ejecutar la función de arranque
bootstrap();
