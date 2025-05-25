import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { StandingsContent } from "@/components/standings-content"

export const metadata = {
  title: "Standings | F1 Data Visualization",
  description: "View Formula 1 driver and constructor championship standings",
}

export default function StandingsPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Standings</h1>
        <p className="text-muted-foreground">
          View the current Formula 1 driver and constructor championship standings
        </p>
      </div>

      <Suspense fallback={<StandingsSkeleton />}>
        <StandingsContent />
      </Suspense>
    </main>
  )
}

function StandingsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <Skeleton className="h-[600px] w-full rounded-lg" />
    </div>
  )
}
