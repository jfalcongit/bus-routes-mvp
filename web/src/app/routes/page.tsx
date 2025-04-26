/**
 * Página de Rutas
 *
 * Esta página muestra las rutas de autobuses disponibles con sus paradas y horarios.
 * Los datos se revalidan cada 60 segundos para mantener la información actualizada.
 */

// Revalidación de datos cada 60 segundos
export const revalidate = 60;

import { makeApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import RoutesClient from "./RoutesClient";

/**
 * Componente de servidor que obtiene datos de rutas mediante GraphQL
 * y los pasa al componente cliente para su renderización
 */
export default async function RoutesPage() {
  const client = makeApolloClient();

  try {
    const { data } = await client.query({
      query: gql`
        query {
          routes(page: 1, perPage: 100) {
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
    });

    return <RoutesClient initialRoutes={data.routes} />;
  } catch (error) {
    console.error("Error al cargar las rutas:", error);
    return <div>Error al cargar las rutas. Por favor, intente nuevamente.</div>;
  }
}
