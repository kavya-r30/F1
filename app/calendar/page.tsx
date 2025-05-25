import { Suspense } from "react"
import { getEvents } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RaceCard } from "@/components/race-card"

export const metadata = {
  title: "Calendar | F1 Data Visualization",
  description: "View the complete Formula 1 race calendar with dates, locations, and session times",
}

export default function CalendarPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Calendar</h1>
        <p className="text-muted-foreground">
          View the complete Formula 1 race calendar with dates, locations, and session times
        </p>
      </div>

      <Suspense fallback={<CalendarPageSkeleton />}>
        <CalendarContent />
      </Suspense>
    </main>
  )
}

async function CalendarContent() {
  const currentYear = new Date().getFullYear()
  const events = await getEvents(currentYear)

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  const now = new Date()
  const pastEvents = sortedEvents.filter((event) => new Date(event.date) < now)
  const upcomingEvents = sortedEvents.filter((event) => new Date(event.date) >= now)

  const nextEvent = upcomingEvents[0]

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Races</TabsTrigger>
          <TabsTrigger value="past">Past Races</TabsTrigger>
          <TabsTrigger value="all">All Races</TabsTrigger>
        </TabsList>

        <div className="text-sm text-muted-foreground">
          {currentYear} Season • {events.length} Races
        </div>
      </div>

      <TabsContent value="upcoming">
        {nextEvent && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Next Race</h2>
            <RaceCard event={nextEvent} isNextRace={true} />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Upcoming Races</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.slice(1).map((event, index) => (
            <div key={event.round}>
              <RaceCard event={event} />
            </div>
          ))}

          {upcomingEvents.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No upcoming races for this season</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="past">
        <h2 className="text-2xl font-bold mb-4">Past Races</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event, index) => (
            <div key={event.round}>
              <RaceCard event={event} isPast={true} />
            </div>
          ))}

          {pastEvents.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No past races for this season yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="all">
        <h2 className="text-2xl font-bold mb-4">Full {currentYear} Calendar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event, index) => (
            <div key={event.round}>
              <RaceCard
                event={event}
                isPast={new Date(event.date) < now}
                isNextRace={nextEvent && event.round === nextEvent.round}
              />
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function CalendarPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-6 w-[150px]" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[180px] w-full rounded-lg" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
