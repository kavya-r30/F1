import { Suspense } from "react"
import { getEvents } from "@/lib/api"
import { CircuitCard } from "@/components/circuit-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata = {
  title: "Circuits | F1 Data Visualization",
  description: "Explore detailed information about Formula 1 circuits from around the world",
}

export default function CircuitsPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Circuits</h1>
        <p className="text-muted-foreground">
          Explore detailed information about Formula 1 circuits from around the world, including track layouts and
          circuit records.
        </p>
      </div>

      <Suspense fallback={<CircuitsPageSkeleton />}>
        <CircuitsList />
      </Suspense>
    </main>
  )
}

async function CircuitsList() {
  const currentYear = new Date().getFullYear()
  const events = await getEvents(currentYear)

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{currentYear} Season Circuits</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedEvents.map((event, index) => (
          <div key={event.round}>
            <CircuitCard
              circuit={{
                name: event.event_name,
                country: event.country,
                year: currentYear,
                event: event.name,
                location: event.location,
                round: event.round,
                date: event.date,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function CircuitsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[220px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
