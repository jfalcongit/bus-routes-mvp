/**
 * Cliente Apollo para comunicación GraphQL
 *
 * Este módulo configura y exporta una función para crear un cliente Apollo
 * que se conecta al endpoint GraphQL especificado en las variables de entorno.
 */

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import fetch from "cross-fetch";

/**
 * URL del servidor GraphQL obtenida de variables de entorno
 */
const GRAPHQL_URL = process.env.GRAPHQL_API_URL;

if (!GRAPHQL_URL) {
  throw new Error(
    "Environment variable GRAPHQL_API_URL must be set to your GraphQL endpoint"
  );
}

/**
 * Crea y configura una instancia de cliente Apollo
 * @returns {ApolloClient} Cliente configurado para comunicación GraphQL
 */
export function makeApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: GRAPHQL_URL,
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
