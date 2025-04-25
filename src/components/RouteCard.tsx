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
      className="flex flex-col items-center gap-4 rounded-lg border-l-4 border-brand-purple bg-white p-4 text-brand-night shadow hover:shadow-md"
      href={`/routes/${id}`}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <StaticMapThumb {...thumb} />
        <div className="hidden md:flex flex-col flex-1">
          <h3 className="text-lg font-semibold">
            {origin} <span className="text-brand-purple">→</span> {destination}
          </h3>
        </div>
        <Badge
          className="bg-brand-yellow text-brand-night py-1 px-2 text-sm"
          variant="primary"
        >
          {fare.toFixed(2)} Bs
        </Badge>
      </div>
      <div className="flex md:hidden flex-col flex-1">
        <h3 className="text-lg font-semibold">
          {origin} <span className="text-brand-purple">→</span> {destination}
        </h3>
      </div>
    </Link>
  );
}
