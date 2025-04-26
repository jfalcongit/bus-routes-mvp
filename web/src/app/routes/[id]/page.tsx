// app/routes/[id]/page.tsx
import { makeApolloClient } from "@/lib/apolloClient";
import { Route as RouteType } from "@/types/routes";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";
import RouteDetailClient from "./RouteDetailClient";

interface PageProps {
  params: { id: string };
}

export default async function RouteDetailPage({ params }: PageProps) {
  const { id } = params;
  const client = makeApolloClient();

  const { data, error } = await client.query<{
    route: RouteType | null;
  }>({
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

  if (error || !data.route) {
    notFound();
  }

  return <RouteDetailClient route={data.route!} />;
}
