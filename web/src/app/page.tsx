/**
 * Página principal (Home) de la aplicación Rutas de Autobuses
 * Muestra una imagen principal, título de bienvenida y botón para ver rutas
 */

import heroImage from "@/assets/images/hero.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

/**
 * Componente de la página de inicio
 */
export default function Home() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center gap-6 p-8 text-center">
      {/* Sección de imagen hero */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-lg shadow-md">
        <Image
          src={heroImage}
          alt="Banner de Rutas de Autobuses"
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 1200px"
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      {/* Título principal */}
      <h1 className="text-4xl font-extrabold tracking-tight text-brand-purple md:text-6xl mt-12">
        Bienvenido a{" "}
        <span className="text-brand-purple-dark">Rutas de Autobuses</span>
      </h1>

      {/* Descripción de la aplicación */}
      <p className="max-w-xl text-lg text-brand-night/80">
        Encuentra las mejores rutas de autobuses para desplazarte.
      </p>

      {/* Botón de llamada a la acción */}
      <Button variant="primary" asChild>
        <Link href="/routes">Ver rutas</Link>
      </Button>
    </main>
  );
}
