"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Componente Tabs (Pestañas)
 *
 * Implementación accesible de un sistema de pestañas usando Radix UI.
 * Este es el componente raíz que contiene toda la funcionalidad de pestañas.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Pestaña 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Pestaña 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Contenido de la pestaña 1</TabsContent>
 *   <TabsContent value="tab2">Contenido de la pestaña 2</TabsContent>
 * </Tabs>
 * ```
 */
const Tabs = TabsPrimitive.Root;

/**
 * Componente TabsList
 *
 * Contenedor para los botones de pestañas (TabsTrigger).
 * Proporciona los estilos y la estructura para la lista de pestañas.
 */
const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * Componente TabsTrigger
 *
 * Botón que activa una pestaña específica.
 * Muestra un estilo diferente cuando está activo para indicar la pestaña seleccionada.
 * Debe tener un valor que corresponda con el TabsContent relacionado.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Componente TabsContent
 *
 * Contenedor para el contenido de una pestaña específica.
 * Se muestra cuando la pestaña correspondiente está activa.
 * Debe tener un valor que corresponda con el TabsTrigger relacionado.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
