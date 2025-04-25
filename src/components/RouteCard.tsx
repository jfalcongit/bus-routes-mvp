import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import StaticMapThumb from "./StaticMapThumb";

interface Props {
  id: string;
  origin: string;
  destination: string;
  fare: number;
  thumb: { lat: number; lng: number };
}

export default function RouteCard({
  id,
  origin,
  destination,
  fare,
  thumb,
}: Props) {
  return (
    <Link
      href={`/routes/${id}`}
      className="flex items-center gap-4 rounded-lg border-l-4 border-brand-purple bg-white p-4 text-brand-night shadow hover:shadow-md"
    >
      <StaticMapThumb {...thumb} />
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold">
          {origin} <span className="text-brand-purple">→</span> {destination}
        </h3>
      </div>
      <Badge
        className="bg-brand-yellow text-brand-night py-1 px-2 text-sm"
        variant="primary"
      >
        ${fare.toFixed(2)}
      </Badge>
    </Link>
  );
}
