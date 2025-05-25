import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { RacePositionForm } from "@/components/race-position-form"
import { RacePositionVisualization } from "@/components/race-position-visualization"

export const metadata = {
  title: "Race Positions | F1 Data Visualization",
  description: "Analyze Formula 1 race positions throughout the race",
}

export default function RacePositionsPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Race Position Analysis</h1>
        <p className="text-muted-foreground">
          Analyze how driver positions change throughout the race and identify the biggest position gains and losses
        </p>
      </div>

      <Suspense fallback={<RacePositionSkeleton />}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <RacePositionForm />
          </div>
          <div className="lg:col-span-3">
            <RacePositionVisualization />
          </div>
        </div>
      </Suspense>
    </main>
  )
}

function RacePositionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
      <div className="lg:col-span-3">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    </div>
  )
}
