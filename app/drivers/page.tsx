import { Suspense } from "react"
import { getDrivers } from "@/lib/api"
import { DriverCard } from "@/components/driver-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Drivers | F1 Data Visualization",
  description: "Explore information about Formula 1 drivers and their performance statistics",
}

export default function DriversPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Drivers</h1>
        <p className="text-muted-foreground">
          Explore information about Formula 1 drivers and their performance statistics
        </p>
      </div>

      <Suspense fallback={<DriversPageSkeleton />}>
        <DriversList />
      </Suspense>
    </main>
  )
}

async function DriversList() {
  const drivers = await getDrivers()

  const driversByTeam: Record<string, typeof drivers> = {}

  drivers.forEach((driver) => {
    if (!driversByTeam[driver.team_name]) {
      driversByTeam[driver.team_name] = []
    }
    driversByTeam[driver.team_name].push(driver)
  })

  const sortedTeams = Object.keys(driversByTeam).sort((a, b) => {
    const aPoints = driversByTeam[a][0]?.points || 0
    const bPoints = driversByTeam[b][0]?.points || 0
    return bPoints - aPoints
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Drivers</TabsTrigger>
            <TabsTrigger value="by-team">By Team</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {drivers.map((driver, index) => (
                <div
                  key={driver.driver_number}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <DriverCard driver={driver} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="by-team" className="mt-6">
            <div className="space-y-10">
              {sortedTeams.map((team, teamIndex) => (
                <div key={team} className="space-y-4">
                  <h2 className="text-2xl font-bold">{team}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {driversByTeam[team].map((driver, driverIndex) => (
                      <div
                        key={driver.driver_number}
                        className="opacity-0 animate-fade-in"
                        style={{ animationDelay: `${teamIndex * 200 + driverIndex * 100}ms` }}
                      >
                        <DriverCard driver={driver} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
 
      </div>

    </div>
  )
}

function DriversPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-full sm:w-[300px]" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
