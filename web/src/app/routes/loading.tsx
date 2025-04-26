import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <Skeleton className="h-8 my-6 w-1/3" />
      <Skeleton className="h-12 my-6" />
      <Skeleton className="h-24 my-6" />
      <Skeleton className="h-24 my-6" />
      <Skeleton className="h-24 my-6" />
    </div>
  );
}
