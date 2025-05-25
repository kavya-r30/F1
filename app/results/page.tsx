import Link from "next/link"
import { Suspense } from "react"
import { getEvents, getRaceResults } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata = {
  title: "Race Results | F1 Data Visualization",
  description: "View race results, driver standings, and team standings from Formula 1 races",
}

export default function ResultsPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Results</h1>
        <p className="text-muted-foreground">
          View race results, driver standings, and team standings from Formula 1 races
        </p>
      </div>

      <Suspense fallback={<ResultsPageSkeleton />}>
        <ResultsPageContent />
      </Suspense>
    </main>
  )
}

async function ResultsPageContent() {
  const currentYear = new Date().getFullYear()
  const events = await getEvents(currentYear)

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  const now = new Date()
  const pastEvents = sortedEvents.filter((event) => new Date(event.date) < now)

  let latestRaceResult = null
  if (pastEvents.length > 0) {
    try {
      latestRaceResult = await getRaceResults(currentYear, pastEvents[0].name)
    } catch (error) {
      console.error("Error fetching latest race result:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{currentYear} Race Results</h2>
        <Select defaultValue={currentYear.toString()}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year} Season
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {latestRaceResult && (
        <Card className="opacity-0 animate-fade-in">
          <CardHeader>
            <CardTitle>
              Latest Race: {latestRaceResult.event} - {latestRaceResult.circuit}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Pos</th>
                    <th className="text-left py-3 px-4">Driver</th>
                    <th className="text-left py-3 px-4">Team</th>
                    <th className="text-left py-3 px-4">Grid</th>
                    <th className="text-right py-3 px-4">Points</th>
                    <th className="text-right py-3 px-4">Time/Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestRaceResult.results.map((result, index) => (
                    <tr key={result.driver_number} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{index + 1}</td>
                      <td className="py-3 px-4">{result.driver_name}</td>
                      <td className="py-3 px-4">{result.team}</td>
                      <td className="py-3 px-4 text-right">{result.grid}</td>
                      <td className="py-3 px-4 text-right font-medium">{result.points}</td>
                      <td className="py-3 px-4 text-right">{result.time || result.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link
                href={`/race-results/${currentYear}/${pastEvents[0].name}`}
                className="text-sm text-primary hover:underline"
              >
                View detailed results →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <h3 className="text-xl font-bold mt-8 mb-4">All Race Results</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pastEvents.map((event, index) => (
          <div key={event.round} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <Link href={`/race-results/${currentYear}/${event.name}`} className="block">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{event.event_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    Round {event.round} • {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    {event.country} • {event.location}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}

        {pastEvents.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No race results available for the current season yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function ResultsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <Skeleton className="h-[400px] w-full rounded-lg" />

      <Skeleton className="h-8 w-[200px]" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
