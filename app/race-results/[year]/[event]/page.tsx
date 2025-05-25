import { Suspense } from "react"
import { getRaceResults } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { RaceResultsContent } from "@/components/race-results-content"

interface RaceResultsPageProps {
  params: {
    year: string
    event: string
  }
}

export async function generateMetadata({ params }: RaceResultsPageProps) {
  try {
    const { year, event } = params
    const results = await getRaceResults(Number.parseInt(year), event)

    return {
      title: `${results.event} ${year} Results | F1 Data Visualization`,
      description: `Race results for the ${results.event} Grand Prix in the ${year} Formula 1 season`,
    }
  } catch (error) {
    return {
      title: "Race Results | F1 Data Visualization",
      description: "Formula 1 race results and analysis",
    }
  }
}

export default function RaceResultsPage({ params }: RaceResultsPageProps) {
  const { year, event } = params

  return (
    <main className="container py-8">
      <Suspense fallback={<RaceResultsSkeleton />}>
        <RaceResultsContent year={Number.parseInt(year)} event={event} />
      </Suspense>
    </main>
  )
}

function RaceResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      <Skeleton className="h-[600px] w-full rounded-lg" />
    </div>
  )
}
