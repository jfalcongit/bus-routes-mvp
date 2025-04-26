import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse h-24 rounded-md bg-slate-300", className)}
      {...props}
    />
  );
}

export { Skeleton };
