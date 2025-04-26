# API de Rutas de Autobuses

Este proyecto es la **API** del monorepo Bus Routes MVP, construida con Nest.js, GraphQL y Prisma, diseñada para gestionar rutas de autobuses incluyendo paradas y viajes.

## Características principales

- **CRUD completo** para:
  - Rutas (`Route`)
  - Paradas (`Stop`)
  - Viajes/Salidas (`Trip`)
- **Relaciones anidadas**: cada ruta incluye orden de paradas y viajes.
- **Paginación**, **filtrado** (origén y destino, caso insensible) y **ordenamiento**.
- **Validación de datos** con `class-validator` y `ValidationPipe`.
- **Prisma** como ORM para PostgreSQL.
- **Health Check** en `/health`.
- **Playground GraphQL** (solo en desarrollo).

## Estructura del proyecto

```
api/
├── prisma/                 # Esquema, migraciones y cliente Prisma
│   ├── migrations/         # Migraciones generadas
│   └── schema.prisma       # Modelo de datos
├── src/
│   ├── routes/             # Módulo GraphQL de rutas
│   │   ├── dto/            # DTOs de entrada (GraphQL Inputs)
│   │   ├── models/         # Definiciones de tipos GraphQL (ObjectTypes)
│   │   ├── routes.module.ts
│   │   ├── routes.service.ts
│   │   └── routes.resolver.ts
│   ├── prisma/             # Módulo e inyección de servicio Prisma
│   ├── health.controller.ts# Endpoint `/health`
│   ├── app.module.ts       # Módulo raíz
│   └── main.ts             # Punto de entrada y configuración global
├── test/                   # Pruebas E2E con Jest + Supertest
├── .env                    # Variables de entorno (no versionar)
├── nest-cli.json           # Configuración CLI Nest
├── package.json            # Dependencias y scripts
└── tsconfig.json           # Configuración TypeScript
```

## Instalación y configuración local

1. **Clona** este repositorio y navega a la carpeta `api/`:

   ```bash
   git clone <repo-url>
   cd bus-routes-mvp/api
   ```

2. **Instala** las dependencias:

   ```bash
   npm install
   ```

3. **Crea** un archivo `.env` en `api/` con la siguiente plantilla:

   ```ini
   DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_DB?sslmode=require
   # (Opcional) SENTRY_DSN=<tu-dsn-de-sentry>
   ```

4. **Ejecuta** migraciones y arranca en modo desarrollo:

   ```bash
   npx prisma migrate dev
   npm run start:dev
   ```

5. **Accede**:
   - Playground GraphQL: `http://localhost:3000/graphql`
   - Health Check: `http://localhost:3000/health`

## Scripts disponibles

En `package.json` están definidos los siguientes comandos:

| Comando              | Descripción                                    |
| -------------------- | ---------------------------------------------- |
| `npm run start:dev`  | Inicia Nest.js en modo desarrollo (Hot Reload) |
| `npm run start:prod` | Compila y ejecuta en modo producción           |
| `npm run build`      | Compila TypeScript a JavaScript (en `dist/`)   |
| `npm run lint`       | Ejecuta ESLint                                 |
| `npm test`           | Ejecuta pruebas unitarias (Jest)               |
| `npm run test:e2e`   | Ejecuta pruebas E2E (Jest + Supertest)         |

## Pruebas E2E

1. Configura tu BD de prueba (puede ser SQLite o un Postgres distinto).
2. Ejecuta:
   ```bash
   npm run test:e2e
   ```

Las pruebas cubren los flujos CRUD + filtrado + paginación.

## Despliegue en producción

En DigitalOcean App Platform o similar:

1. **Variables de entorno**:
   - `DATABASE_URL` (cadena de conexión a Postgres).
   - `GRAPHQL_API_URL` (opcional, si el frontend lo consume).
2. **Build Command**:
   ```bash
   npm ci
   npx prisma generate
   npm run build
   ```
3. **Run Command**:
   ```bash
   npx prisma migrate deploy
   npm run start:prod
   ```
4. **Health Check**: configura el endpoint `/health` en la plataforma.
