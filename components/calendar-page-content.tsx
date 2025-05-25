import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RaceCard } from "@/components/race-card"

interface CalendarPageContentProps {
  events: any[]
  year: number
}

export function CalendarPageContent({ events, year }: CalendarPageContentProps) {
  const eventsByMonth: Record<string, any[]> = {}
  events.forEach((event) => {
    const date = new Date(event.date)
    const month = date.toLocaleString("default", { month: "long" })
    if (!eventsByMonth[month]) {
      eventsByMonth[month] = []
    }
    eventsByMonth[month].push(event)
  })

  const currentDate = new Date()
  const pastEvents = events.filter((event) => new Date(event.date) < currentDate)
  const upcomingEvents = events.filter(
    (event) =>
      new Date(event.date) >= currentDate &&
      new Date(event.date) <= new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000),
  )
  const futureEvents = events.filter(
    (event) => new Date(event.date) > new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 opacity-0 animate-[fadeIn_0.5s_forwards]">
        <h1 className="text-3xl font-bold tracking-tight">{year} Formula 1 Calendar</h1>
        <p className="text-muted-foreground">View all races for the {year} Formula 1 season</p>
      </div>

      <Tabs defaultValue="all" className="opacity-0 animate-[fadeIn_0.5s_0.1s_forwards]">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Races</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          <div className="space-y-8">
            {Object.entries(eventsByMonth).map(([month, monthEvents], monthIndex) => (
              <div key={month} className="space-y-4">
                <h2 className="text-2xl font-semibold">{month}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monthEvents.map((event, eventIndex) => (
                    <RaceCard key={event.round} event={event} index={eventIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <RaceCard key={event.round} event={event} isRecent index={index} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No past races yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <RaceCard key={event.round} event={event} index={index} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No upcoming races in the next 30 days</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="future" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          {futureEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureEvents.map((event, index) => (
                <RaceCard key={event.round} event={event} index={index} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No future races beyond the next 30 days</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
