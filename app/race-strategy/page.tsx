import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { RaceStrategyForm } from "@/components/race-strategy-form"
import { RaceStrategyVisualization } from "@/components/race-strategy-visualization"

export const metadata = {
  title: "Race Strategy | F1 Data Visualization",
  description: "Analyze Formula 1 race strategies, including pit stops, tire compounds, and stint lengths",
}

export default function RaceStrategyPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Race Strategy Analysis</h1>
        <p className="text-muted-foreground">
          Analyze Formula 1 race strategies, including pit stops, tire compounds, and stint lengths
        </p>
      </div>

      <Suspense fallback={<RaceStrategySkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-fade-in">
          <div className="md:col-span-1">
            <RaceStrategyForm />
          </div>
          <div className="md:col-span-2">
            <RaceStrategyVisualization />
          </div>
        </div>
      </Suspense>
    </main>
  )
}

function RaceStrategySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
      <div className="md:col-span-2">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    </div>
  )
}
