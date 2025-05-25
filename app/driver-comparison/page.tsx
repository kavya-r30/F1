import { Suspense } from "react"
import { DriverComparisonForm } from "@/components/driver-comparison-form"
import { DriverComparisonResults } from "@/components/driver-comparison-results"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Driver Comparison | F1 Data Visualization",
  description: "Compare performance statistics between Formula 1 drivers head-to-head",
}

export default function DriverComparisonPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Driver Comparison</h1>
        <p className="text-muted-foreground">Compare performance statistics between Formula 1 drivers head-to-head</p>
      </div>

      <Suspense fallback={<DriverComparisonSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-fade-in">
          <div className="md:col-span-1">
            <DriverComparisonForm />
          </div>
          <div className="md:col-span-2">
            <DriverComparisonResults />
          </div>
        </div>
      </Suspense>
    </main>
  )
}

function DriverComparisonSkeleton() {
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
