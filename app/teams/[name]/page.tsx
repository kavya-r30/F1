import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { TeamDetails } from "@/components/team-details"
import { fallbackTeams } from "@/lib/fallback-data"
import { getTeamProfile, getTeamStatistics } from "@/lib/api"

interface TeamPageProps {
  params: Promise<{
    name: string
  }>
}

export async function generateMetadata({ params }: TeamPageProps) {
  try {
    const { name } = await params
    const decodedName = decodeURIComponent(name)

    try {
      const teamProfile = await getTeamProfile(decodedName, new Date().getFullYear())
      return {
        title: `${teamProfile.name} | F1 Data Visualization`,
        description: `Explore ${teamProfile.name}'s Formula 1 statistics and performance data`,
      }
    } catch (error) {
      const team = fallbackTeams.find((t) => t.name === decodedName)
      if (team) {
        return {
          title: `${team.name} | F1 Data Visualization`,
          description: `Explore ${team.name}'s Formula 1 statistics and performance data`,
        }
      }
    }

    return {
      title: "Team Details | F1 Data Visualization",
      description: "Explore Formula 1 team details and statistics",
    }
  } catch (error) {
    return {
      title: "Team Details | F1 Data Visualization",
      description: "Explore Formula 1 team details and statistics",
    }
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  return (
    <main className="container py-8">
      <Suspense fallback={<TeamPageSkeleton />}>
        <TeamContent teamName={decodedName} />
      </Suspense>
    </main>
  )
}

async function TeamContent({ teamName }: { teamName: string }) {
  try {
    let teamProfile
    let teamStats

    try {
      // Try to fetch from API
      const currentYear = new Date().getFullYear()
      teamProfile = await getTeamProfile(teamName, currentYear)
      teamStats = await getTeamStatistics(teamName)
    } catch (error) {
      console.error("Error fetching team data from API:", error)

      // If API fails, use fallback data
      const fallbackTeam = fallbackTeams.find((t) => t.name === teamName)
      if (!fallbackTeam) {
        notFound()
      }

      // Create minimal profile from fallback data
      teamProfile = {
        name: fallbackTeam.name,
        drivers: fallbackTeam.drivers,
        points: 0,
        championship_position: 0,
        podiums: 0,
        wins: 0,
        poles: 0,
        best_finish: 0,
      }

      // Create minimal stats from fallback data
      teamStats = {
        name: fallbackTeam.name,
        championship_position: 0,
        points: 0,
        races: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        best_finish: 0,
        avg_points_per_race: 0,
        dnfs: 0,
        drivers: fallbackTeam.drivers,
        driver_avg_positions: {},
      }
    }

    return <TeamDetails profile={teamProfile} statistics={teamStats} />
  } catch (error) {
    console.error("Error loading team data:", error)
    notFound()
  }
}

function TeamPageSkeleton() {
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

      <Skeleton className="h-10 w-[300px]" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  )
}
