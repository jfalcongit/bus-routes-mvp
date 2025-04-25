import { toTime12h } from "@/lib/time";

export function TimeTag({ iso }: { iso: string }) {
  return <span className="font-mono text-sm">{toTime12h(iso)}</span>;
}
