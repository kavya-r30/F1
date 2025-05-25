import { Suspense } from "react"
import { LapComparisonForm } from "@/components/lap-comparison-form"
import { LapComparisonVisualization } from "@/components/lap-comparison-visualization"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Lap Comparison | F1 Data Visualization",
  description: "Compare lap times and telemetry data between different drivers",
}

export default function LapComparisonPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Lap Comparison</h1>
        <p className="text-muted-foreground">
          Compare lap times and telemetry data between different drivers to analyze performance differences
        </p>
      </div>

      <Suspense fallback={<LapComparisonSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-fade-in">
          <div className="md:col-span-1">
            <LapComparisonForm />
          </div>
          <div className="md:col-span-2">
            <LapComparisonVisualization />
          </div>
        </div>
      </Suspense>
    </main>
  )
}

function LapComparisonSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
      <div className="md:col-span-2">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    </div>
  )
}
