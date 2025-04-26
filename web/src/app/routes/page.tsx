import { makeApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import RoutesClient from "./RoutesClient";

export default async function RoutesPage() {
  const client = makeApolloClient();

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
}
