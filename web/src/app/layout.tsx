/**
 * Layout raíz de la aplicación Rutas de Autobuses
 * Define la estructura común para todas las páginas, incluyendo
 * la navegación superior y el contenedor principal.
 */

import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

/**
 * Configuración de la fuente principal Inter de Google Fonts
 * Disponible como variable CSS para su uso en toda la aplicación
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/**
 * Metadatos globales de la aplicación
 * Incluye título, descripción e iconos que se aplicarán a todas las páginas
 */
export const metadata = {
  title: "Rutas de Autobuses",
  description: "MVP para Rutas de Autobuses",
  icons: {
    shortcut:
      "https://cdn.prod.website-files.com/60f18a63987c88051d8d07be/6579cf71b0bf940e88a96128_ICO-32X32.jpg",
  },
};

/**
 * Componente de layout raíz que envuelve todas las páginas
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la página actual
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-white text-brand-night antialiased">
        {/* ----- Barra de navegación superior ----- */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link
              href="/"
              className="text-2xl font-extrabold text-brand-purple"
            >
              Rutas de <span className="text-brand-purple-dark">Autobuses</span>
            </Link>
            <div className="flex gap-4 text-sm font-medium">
              <Link href="/" className="hover:text-brand-purple-dark">
                Inicio
              </Link>
              <Link href="/routes" className="hover:text-brand-purple-dark">
                Rutas
              </Link>
            </div>
          </nav>
        </header>

        {/* ----- Contenido principal de la página ----- */}
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">{children}</div>
      </body>
    </html>
  );
}
