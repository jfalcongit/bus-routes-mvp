export const revalidate = 60; // Revalidación de datos cada 60 segundos

import { makeApolloClient } from "@/lib/apolloClient";
import { Route as RouteType } from "@/types/routes";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";
import RouteDetailClient from "./RouteDetailClient";

/**
 * Props para la página de detalle de ruta
 */
interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Página para mostrar los detalles de una ruta de autobús específica.
 * Obtiene datos desde la API GraphQL usando el ID proporcionado en la URL.
 * Si la ruta no existe o hay un error, muestra una página 404.
 *
 * @param params - Contiene el ID de la ruta a consultar
 */
export default async function RouteDetailPage({ params }: PageProps) {
  const { id } = await params;

  const client = makeApolloClient();

  // Consulta GraphQL para obtener la información detallada de la ruta
  const { data, error } = await client.query<{ route: RouteType | null }>({
    query: gql`
      query GetRoute($id: String!) {
        route(id: $id) {
          id
          fare
          capacity
          stops {
            name
            lat
            lng
          }
          trips {
            departureTime
            arrivalTime
          }
        }
      }
    `,
    variables: { id },
  });

  // Redirecciona a 404 si no se encuentra la ruta o hay un error
  if (error || !data.route) {
    notFound();
  }

  // Renderiza el componente cliente con los datos obtenidos
  return <RouteDetailClient route={data.route} />;
}
