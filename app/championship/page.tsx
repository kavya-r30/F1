import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChampionshipPageContent } from "@/components/championship-page-content"

export const metadata = {
  title: "Championship | F1 Data Visualization",
  description: "Explore the history of Formula 1 championships, including driver and constructor champions",
}

export default function ChampionshipPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Championship History</h1>
        <p className="text-muted-foreground">
          Explore the history of Formula 1 championships, including driver and constructor champions
        </p>
      </div>

      <Suspense fallback={<ChampionshipPageSkeleton />}>
        <ChampionshipPageContent />
      </Suspense>
    </main>
  )
}

function ChampionshipPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <Skeleton className="h-10 w-[300px]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>

      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  )
}
