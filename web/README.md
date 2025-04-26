# Aplicación Web de Rutas de Autobuses

Este proyecto es la **aplicación cliente** del monorepo Bus Routes MVP, construida con Next.js (App Router) y React, que consume la API GraphQL para mostrar rutas de autobús.

## Características principales

- Listado de rutas con **búsqueda en tiempo real** (fuzzy y sin acentos)
- Página de detalle de ruta con ficha de datos y **mapa interactivo** (Google Maps JS API)
- **Optimización** SSR y SSG con Next.js
- **Componentes** separados entre servidor y cliente para mejor performance
- **Skeletons de carga** y optimizaciones de imágenes (Next/Image)
- **Debounce** y **trim** en la barra de búsqueda para UX suave

## Estructura del proyecto

```
web/
├── public/                # (vacío)
├── src/
│   ├── app/               # Rutas de la App Router (page.tsx, loading.tsx, etc.)
│   │   ├── layout.tsx     # Layout raíz
│   │   ├── page.tsx       # Página principal
│   │   └── routes/        # Directorio de rutas (de autobuses)
│   │       ├── loading.tsx# Skeleton en transiciones
│   │       ├── page.tsx   # Página servidor: lista de rutas (de autobuses)
│   │       ├── RoutesClient.tsx   # Componente cliente: listado
│   │       └── [id]/
│   │           ├── loading.tsx    # Skeleton detalle
│   │           ├── page.tsx       # Página servidor: detalle de ruta
│   │           └── RouteDetailClient.tsx # Componente cliente: detalle
│   ├── components/        # Componentes UI reutilizables
│   ├── assets/            # Imágenes importadas para Next/Image
│   ├── lib/               # Helpers (Apollo Client, utilidades)
│   ├── types/             # Definición de tipos TS (Route, Stop, Trip)
│   └── styles/            # CSS global (Tailwind, globals.css)
├── .env.local             # Variables de entorno (no versionar)
├── next.config.js         # Configuración Next.js
├── tsconfig.json          # Configuración TypeScript
└── package.json           # Dependencias y scripts
```

## Variables de Entorno

En `web/.env.local` define:

```ini
NEXT_PUBLIC_API_URL=https://<tu-dominio-api>/graphql
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<tu-google-maps-key>
```

## Instalación y ejecución local

```bash
# Desde la raíz del monorepo\ ncd web
npm install
npm run dev
```

- La aplicación correrá en `http://localhost:3000`.

## Scripts disponibles

| Comando         | Descripción                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Inicia Next.js en modo desarrollo     |
| `npm run build` | Genera la versión de producción       |
| `npm run start` | Inicia servidor Next.js en producción |
| `npm run lint`  | Ejecuta ESLint                        |

|
| `npm run prepare` | Genera tipos a partir de GraphQL (opcional)|

## Despliegue

Puedes desplegar esta app en:

- **Vercel**: Push al repositorio, configura variables en el Dashboard.
- **DigitalOcean App Platform**: Selecciona el directorio `web`, añade env vars, y construye con `npm run build` + `npm start`.
