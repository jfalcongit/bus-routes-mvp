import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center gap-6 p-8 text-center">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-lg shadow-md">
        <Image
          src="/images/hero.png"
          alt="Bus routes hero"
          width={1200}
          height={400}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-brand-purple md:text-6xl mt-12">
        Bienvenido a{" "}
        <span className="text-brand-purple-dark">Rutas de Autobuses</span>
      </h1>
      <p className="max-w-xl text-lg text-brand-night/80">
        Encuentra las mejores rutas de autobuses para desplazarte.
      </p>
      <Button variant="primary" asChild>
        <Link href="/routes">Ver rutas</Link>
      </Button>
    </main>
  );
}
