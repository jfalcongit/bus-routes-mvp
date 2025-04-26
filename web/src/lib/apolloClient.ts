import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";

const GRAPHQL_URL = process.env.GRAPHQL_API_URL;

if (!GRAPHQL_URL) {
  throw new Error(
    "Environment variable GRAPHQL_API_URL or NEXT_PUBLIC_API_URL must be set to your GraphQL endpoint"
  );
}

export function makeApolloClient() {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: GRAPHQL_URL,
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
