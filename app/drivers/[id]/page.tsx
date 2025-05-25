import { Suspense } from "react"
import { getDriverProfile, getDriverResults, getDriverStatistics } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { DriverDetails } from "@/components/driver-details"
import { notFound } from "next/navigation"
import { fallbackDrivers } from "@/lib/fallback-data"

interface DriverPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DriverPageProps) {
  try {
    const { id } = params
    let driver = null

    try {
      driver = await getDriverProfile(id)
    } catch (error) {
      console.error("Error fetching driver profile from API:", error)
      const fallbackDriver = fallbackDrivers.find((d) => d.driver_number === id)
      if (fallbackDriver) {
        driver = {
          name: fallbackDriver.name,
          number: fallbackDriver.driver_number,
          team: fallbackDriver.team_name,
        }
      }
    }

    if (!driver) {
      return {
        title: "Driver Not Found | F1 Data Visualization",
        description: "The requested driver could not be found",
      }
    }

    return {
      title: `${driver.name} | F1 Data Visualization`,
      description: `Explore ${driver.name}'s Formula 1 statistics and performance data`,
    }
  } catch (error) {
    return {
      title: "Driver Details | F1 Data Visualization",
      description: "Explore Formula 1 driver details and statistics",
    }
  }
}

export default function DriverPage({ params }: DriverPageProps) {
  const { id } = params

  return (
    <main className="container py-8">
      <Suspense fallback={<DriverPageSkeleton />}>
        <DriverContent driverId={id} />
      </Suspense>
    </main>
  )
}

async function DriverContent({ driverId }: { driverId: string }) {
  try {
    let driver = null
    let currentSeasonStats = null
    let allSeasonsStats = null
    let recentResults = null

    try {
      const currentYear = new Date().getFullYear()

      const [profileData, currentStatsData, allStatsData, resultsData] = await Promise.all([
        getDriverProfile(driverId),
        getDriverStatistics(driverId, currentYear),
        getDriverStatistics(driverId),
        getDriverResults(driverId, currentYear),
      ])

      driver = profileData
      currentSeasonStats = currentStatsData
      allSeasonsStats = allStatsData
      recentResults = resultsData
    } catch (error) {
      console.error("Error fetching driver data from API:", error)

      const fallbackDriver = fallbackDrivers.find((d) => d.driver_number === driverId)
      if (!fallbackDriver) {
        notFound()
      }

      driver = {
        name: fallbackDriver.name,
        number: fallbackDriver.driver_number,
        team: fallbackDriver.team_name,
        country: "Unknown",
        points: 0,
        championship_position: 0,
        races: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
      }
    }

    if (!driver) {
      notFound()
    }

    const combinedData = {
      ...driver,
      recent_races: recentResults || [],
    }

    return (
      <DriverDetails driver={combinedData} currentSeasonStats={currentSeasonStats} allSeasonsStats={allSeasonsStats} />
    )
  } catch (error) {
    console.error("Error loading driver data:", error)
    notFound()
  }
}

function DriverPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
      </div>

      <Skeleton className="h-10 w-[400px]" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  )
}
