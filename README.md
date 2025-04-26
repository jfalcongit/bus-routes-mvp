# Monorepo Bus Routes MVP

Este repositorio es un **monorepo** para el MVP de Rutas de Autobuses, que contiene tanto el **API** (Nest.js + GraphQL + Prisma) como la aplicación **Web** cliente (Next.js).

## Estructura del Monorepo

```
/ (raíz)
├── api/          # Servidor API en Nest.js con GraphQL
└── web/          # Aplicación cliente en Next.js
```

### `/api`

- **Framework**: Nest.js
- **Capa API**: GraphQL (Apollo)
- **ORM**: Prisma (PostgreSQL)
- **Características**:
  - Operaciones CRUD para `Route`, `Stop`, `Trip`
  - Relaciones anidadas (paradas y viajes)
  - Paginación, filtrado y ordenamiento
  - Migraciones de base de datos
  - Endpoint de health check (`GET /health`)
  - Validación de entrada con `class-validator`

### `/web`

- **Framework**: Next.js (App Router)
- **Data Fetching**: Componentes de servidor que consumen el API GraphQL
- **Cliente**: Componentes React para UI (búsqueda, mapas, listado, detalle)
- **Estilos**: Tailwind CSS / shadcn/ui
- **Características**:
  - Listado de rutas con búsqueda en tiempo real (fuzzy y sin acentos)
  - Página de detalle de ruta con integración de mapas (Google Maps JS API)
  - Skeletons de carga y optimizaciones SSR
  - Separación clara entre componentes de servidor y cliente

## Guía de Inicio Rápido

### Prerrequisitos

- Node.js (>=18)
- npm o Yarn
- Base de datos PostgreSQL (por ejemplo, DigitalOcean Managed Postgres)

### Variables de Entorno

En `/api`, crea un archivo `.env`:

```ini
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/DB?sslmode=require
```

En `/web`, crea un archivo `.env.local`:

```ini
NEXT_PUBLIC_API_URL=https://<tu-dominio-api>/graphql
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<tu-google-maps-key>
```

### Ejecutar en Local

#### Backend (API)

```bash
# desde la raíz del repositorio
cd api
npm install
npx prisma migrate dev       # ejecuta migraciones en local
npm run start:dev            # inicia Nest.js en modo dev
```

- **Playground GraphQL**: [http://localhost:3000/graphql](http://localhost:3000/graphql)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

#### Frontend (Web)

```bash
cd web
npm install
npm run dev                  # inicia Next.js en modo dev
```

- **App**: [http://localhost:3001](http://localhost:3001) (o el puerto predeterminado de Next.js)

## Despliegue

Puedes desplegar ambos proyectos de forma independiente:

- **API**: DigitalOcean App Platform
- **Web**: DigitalOcean App Platform

### Sugerencias de CI/CD

- En la rama `api`, ejecuta `npm test` y `npm run test:e2e` en tu pipeline.
- En la rama `web`, ejecuta `npm run lint` y `npm run build`.

## License

MIT License

Copyright (c) 2025 Jorge Falcón

