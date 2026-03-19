import { SectionCard } from "@/components/ui/section-card";
import { Skeleton } from "@/components/ui/skeleton";

export function PokemonCardSkeleton() {
  return (
    <div className="glass-panel overflow-hidden rounded-[30px] p-5">
      <Skeleton className="h-4 w-20" />
      <div className="mt-5 flex items-center justify-center">
        <Skeleton className="h-40 w-40 rounded-full" />
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-6 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="page-shell py-4 sm:py-5">
      <div className="glass-panel overflow-hidden rounded-[34px] p-4 sm:p-5">
        <div className="grid gap-4 xl:h-[calc(100vh-112px)] xl:grid-cols-[minmax(0,1.55fr)_340px] xl:grid-rows-[auto_auto_minmax(0,1fr)]">
          <Skeleton className="xl:col-span-2 h-20 rounded-[28px]" />
          <Skeleton className="xl:col-span-2 h-36 rounded-[28px]" />

          <div className="grid gap-4 xl:grid-rows-[minmax(0,0.46fr)_minmax(0,0.42fr)_auto]">
            <SectionCard contentClassName="space-y-3">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-3 gap-2 md:grid-cols-6 xl:grid-cols-9">
                {Array.from({ length: 18 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-[18px]" />
                ))}
              </div>
            </SectionCard>

            <SectionCard contentClassName="space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 rounded-[18px]" />
                ))}
              </div>
            </SectionCard>

            <Skeleton className="h-16 rounded-[24px]" />
          </div>

          <div className="grid gap-4 xl:grid-rows-[auto_minmax(0,1fr)]">
            <SectionCard contentClassName="space-y-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-48" />
            </SectionCard>

            <SectionCard contentClassName="space-y-4">
              <Skeleton className="h-64 rounded-[28px]" />
              <Skeleton className="h-16 rounded-[18px]" />
              <Skeleton className="h-16 rounded-[18px]" />
              <Skeleton className="h-16 rounded-[18px]" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-[18px]" />
                <Skeleton className="h-16 rounded-[18px]" />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
