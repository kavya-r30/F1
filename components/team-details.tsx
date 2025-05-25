import Link from "next/link"
import Image from "next/image"
import { DataCard } from "@/components/data-card"
import { TrophyIcon, FlagIcon, AwardIcon, UsersIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeamDetailsProps {
  profile: any
  statistics: any
}

export function TeamDetails({ profile, statistics }: TeamDetailsProps) {
  const stats = {
    championships: statistics.championships || 0,
    first_entry: statistics.first_entry || "Unknown",
    current_season: {
      position: profile.championship_position || "-",
      points: profile.points || 0,
      wins: profile.wins || 0,
      podiums: profile.podiums || 0,
      poles: statistics.poles || 0,
      dnfs: statistics.dnfs || 0,
    },
    career: {
      wins: statistics.wins || 0,
      podiums: statistics.podiums || 0,
      poles: statistics.poles || 0,
      races: statistics.races || 0,
    },
    current_drivers: profile.drivers || [],
    seasons: statistics.season_summaries || [],
    history: statistics.history || [],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 opacity-0 animate-[fadeIn_0.5s_forwards] pt-3">
          <div className="rounded-lg overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 aspect-[4/3] relative">
            <Image
              src={`/teams/${profile.name}.jpg` || '/placeholder.svg'}
              alt={profile.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="opacity-0 animate-[fadeIn_0.5s_forwards]">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <div className="text-muted-foreground mt-1">
              {stats.current_season.position ? `P${stats.current_season.position} in Constructor Championship` : ""}
            </div>
          </div>

          <Card className="opacity-0 animate-[fadeIn_0.5s_0.1s_forwards]">
            <CardHeader className="pb-2">
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Championship Position</div>
                  <div className="font-medium">{stats.current_season.position || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Points</div>
                  <div className="font-medium">{stats.current_season.points}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Wins</div>
                  <div className="font-medium">{stats.current_season.wins}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Podiums</div>
                  <div className="font-medium">{stats.current_season.podiums}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Championships</div>
                  <div className="font-medium">{stats.championships}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">First Entry</div>
                  <div className="font-medium">{stats.first_entry}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DataCard
          title="Career Wins"
          value={stats.career.wins}
          icon={<TrophyIcon className="h-4 w-4" />}
          index={0}
        />
        <DataCard
          title="Career Podiums"
          value={stats.career.podiums}
          icon={<AwardIcon className="h-4 w-4" />}
          index={1}
        />
        <DataCard
          title="Career Races"
          value={stats.career.races}
          icon={<FlagIcon className="h-4 w-4" />}
          index={2}
        />
        <DataCard
          title="Current Drivers"
          value={stats.current_drivers.length}
          icon={<UsersIcon className="h-4 w-4" />}
          index={3}
        />
      </div>

      <Tabs defaultValue="drivers" className="opacity-0 animate-[fadeIn_0.5s_0.2s_forwards]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="drivers">Current Drivers</TabsTrigger>
          <TabsTrigger value="seasons">Past Seasons</TabsTrigger>
        </TabsList>
        <TabsContent value="drivers" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {stats.current_drivers.map((driver: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {driver.number}
                      </div>
                      <div>
                        <Link href={`/drivers/${driver.number}`} className="font-medium hover:underline">
                          {driver.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">{driver.abbreviation}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {stats.current_drivers.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No driver data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seasons" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {stats.seasons.map((season: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <div className="font-medium">{season.year}</div>
                      <div className="text-sm text-muted-foreground">
                        {Array.isArray(season.drivers) ? season.drivers.join(", ") : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium">{season.championship_position || "-"}</span>
                        <span className="text-muted-foreground"> position</span>
                      </div>
                      <div className="text-sm font-medium">{season.points || 0} pts</div>
                    </div>
                  </div>
                ))}
                {stats.seasons.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No historical data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
