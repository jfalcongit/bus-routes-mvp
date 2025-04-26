import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-10">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-12" />
      <Skeleton className="h-24" />
    </div>
  );
}
