import { Suspense } from "react"
import { getCircuitInfo } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { CircuitDetails } from "@/components/circuit-details"
import { notFound } from "next/navigation"

interface CircuitPageProps {
  params: {
    year: string
    event: string
  }
}

export async function generateMetadata({ params }: CircuitPageProps) {
  try {
    const { year, event } = params
    const circuitInfo = await getCircuitInfo(Number.parseInt(year), event)

    return {
      title: `${circuitInfo.name} | F1 Data Visualization`,
      description: `Explore the ${circuitInfo.name} circuit in ${circuitInfo.country}`,
    }
  } catch (error) {
    return {
      title: "Circuit Details | F1 Data Visualization",
      description: "Explore Formula 1 circuit details and information",
    }
  }
}

export default function CircuitPage({ params }: CircuitPageProps) {
  const { year, event } = params

  return (
    <main className="container py-8">
      <Suspense fallback={<CircuitPageSkeleton />}>
        <CircuitContent year={Number.parseInt(year)} event={event} />
      </Suspense>
    </main>
  )
}

async function CircuitContent({ year, event }: { year: number; event: string }) {
  try {
    const circuitInfo = await getCircuitInfo(year, event)

    if (!circuitInfo) {
      notFound()
    }

    return <CircuitDetails circuitInfo={{ year, event, circuit_info: circuitInfo }} />
  } catch (error) {
    console.error("Error loading circuit data:", error)
    notFound()
  }
}

function CircuitPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-1/2 mt-6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}
