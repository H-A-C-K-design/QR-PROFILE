import React from "react";
import { cn } from "@/lib/utils";

export default function LoadingSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/[0.06] backdrop-blur-sm",
        className
      )}
    />
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center text-center space-y-4">
        <LoadingSkeleton className="w-28 h-28 rounded-full" />
        <LoadingSkeleton className="h-7 w-48 rounded-lg" />
        <LoadingSkeleton className="h-4 w-32 rounded-md" />
        <LoadingSkeleton className="h-4 w-40 rounded-md" />
      </div>

      <div className="mt-8 space-y-3">
        <LoadingSkeleton className="h-12 w-full rounded-2xl" />
        <LoadingSkeleton className="h-12 w-full rounded-2xl" />
        <LoadingSkeleton className="h-12 w-full rounded-2xl" />
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex justify-center gap-4">
        <LoadingSkeleton className="h-10 w-28 rounded-xl" />
        <LoadingSkeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}
