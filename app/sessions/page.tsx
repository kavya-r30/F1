import { Suspense } from "react"
import { getEvents, getSessionResults } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { SessionsPageContent } from "@/components/sessions-page-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Sessions | F1 Data Visualization",
  description: "Explore detailed data from Formula 1 practice, qualifying, sprint, and race sessions",
}

export default function SessionsPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Sessions</h1>
        <p className="text-muted-foreground">
          Explore detailed data from Formula 1 practice, qualifying, sprint, and race sessions
        </p>
      </div>

      <Suspense fallback={<SessionsPageSkeleton />}>
        <SessionsPageTabs />
      </Suspense>
    </main>
  )
}

async function SessionsPageTabs() {
  const currentYear = new Date().getFullYear()
  const events = await getEvents(currentYear)

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  const now = new Date()
  const pastEvents = sortedEvents.filter((event) => new Date(event.date) < now)
  let latestQualifyingResult = null
  if (pastEvents.length > 0) {
    try {
      latestQualifyingResult = await getSessionResults(currentYear, pastEvents[0].name, "Q")
    } catch (error) {
      console.error("Error fetching latest qualifying result:", error)
    }
  }

  return (
    <div className="space-y-8 opacity-0 animate-fade-in">
      <Tabs defaultValue="latest" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="latest">Latest Session</TabsTrigger>
          <TabsTrigger value="events">By Event</TabsTrigger>
        </TabsList>

        <TabsContent value="latest">
          {latestQualifyingResult ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {latestQualifyingResult.session_type === "Q" ? "Qualifying" : latestQualifyingResult.session_type} -{" "}
                  {latestQualifyingResult.event}
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
                        {latestQualifyingResult.session_type === "Q" && (
                          <>
                            <th className="text-right py-3 px-4">Q1</th>
                            <th className="text-right py-3 px-4">Q2</th>
                            <th className="text-right py-3 px-4">Q3</th>
                          </>
                        )}
                        <th className="text-right py-3 px-4">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestQualifyingResult.results.map((result, index) => (
                        <tr key={result.driver_number} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{index + 1}</td>
                          <td className="py-3 px-4">{result.driver_name}</td>
                          <td className="py-3 px-4">{result.team}</td>
                          {latestQualifyingResult.session_type === "Q" && (
                            <>
                              <td className="py-3 px-4 text-right">{result.q1 || "-"}</td>
                              <td className="py-3 px-4 text-right">{result.q2 || "-"}</td>
                              <td className="py-3 px-4 text-right">{result.q3 || "-"}</td>
                            </>
                          )}
                          <td className="py-3 px-4 text-right font-medium">{result.time || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No session results available for the current season yet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events">
          <SessionsPageContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SessionsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      <Skeleton className="h-10 w-[300px]" />

      <Skeleton className="h-[500px] w-full rounded-lg" />
    </div>
  )
}
