import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataCard } from "@/components/data-card"
import { TrophyIcon, FlagIcon, AwardIcon, CircleOffIcon } from "lucide-react"
import Image from "next/image"

interface DriverDetailsProps {
  driver: any
  currentSeasonStats?: any
  allSeasonsStats?: any
}

export function DriverDetails({ driver, currentSeasonStats, allSeasonsStats }: DriverDetailsProps) {
  const stats = {
    championships: driver.championships || 0,
    first_race: driver.first_race || "Unknown",
    current_season: {
      position: driver.championship_position || currentSeasonStats?.championship_position || "-",
      points: driver.points || currentSeasonStats?.points || 0,
      wins: driver.wins || currentSeasonStats?.wins || 0,
      podiums: driver.podiums || currentSeasonStats?.podiums || 0,
      poles: driver.poles || currentSeasonStats?.poles || 0,
      dnfs: driver.dnfs || currentSeasonStats?.dnfs || 0,
    },
    career: {
      wins: allSeasonsStats?.wins || driver.wins || 0,
      podiums: allSeasonsStats?.podiums || driver.podiums || 0,
      poles: allSeasonsStats?.poles || driver.poles || 0,
      dnfs: allSeasonsStats?.dnfs || driver.dnfs || 0,
    },
    recent_races: driver.recent_races || [],
    seasons: allSeasonsStats?.seasons || driver.seasons || [],
    teams: driver.teams || [],
  }

  const getDriverImageUrl = (driverNumber: string) => {
    return `/placeholder.svg?height=300&width=300&text=${driverNumber}`
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 opacity-0 animate-[fadeIn_0.5s_forwards]">
          <div className="rounded-lg overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 aspect-square relative">
            <Image
              src={getDriverImageUrl(driver.number) || "/placeholder.svg"}
              alt={driver.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="opacity-0 animate-[fadeIn_0.5s_forwards]">
            <h1 className="text-3xl font-bold">{driver.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-red-500 text-white px-2 py-0.5 rounded text-sm font-medium">#{driver.number}</div>
              <div className="text-muted-foreground">{driver.team}</div>
            </div>
          </div>

          <Card className="opacity-0 animate-[fadeIn_0.5s_0.1s_forwards]">
            <CardHeader className="pb-2">
              <CardTitle>Driver Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Team</div>
                  <div className="font-medium">{driver.team}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Number</div>
                  <div className="font-medium">{driver.number}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Country</div>
                  <div className="font-medium">{driver.country}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Championship Position</div>
                  <div className="font-medium">{stats.current_season.position}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Points</div>
                  <div className="font-medium">{stats.current_season.points}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Races</div>
                  <div className="font-medium">{currentSeasonStats?.races || driver.races || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DataCard title="Career Wins" value={stats.career.wins} icon={<TrophyIcon className="h-4 w-4" />} index={0} />
        <DataCard
          title="Career Podiums"
          value={stats.career.podiums}
          icon={<AwardIcon className="h-4 w-4" />}
          index={1}
        />
        <DataCard title="Career Poles" value={stats.career.poles} icon={<FlagIcon className="h-4 w-4" />} index={2} />
        <DataCard
          title="Career DNFs"
          value={stats.career.dnfs}
          icon={<CircleOffIcon className="h-4 w-4" />}
          index={3}
        />
      </div>

      <Tabs defaultValue="current-season" className="opacity-0 animate-[fadeIn_0.5s_0.2s_forwards]">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current-season">Current Season</TabsTrigger>
          <TabsTrigger value="all-seasons">All Season Stats</TabsTrigger>
          <TabsTrigger value="season-history">Season History</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
        </TabsList>

        <TabsContent value="current-season" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          <Card>
            <CardHeader>
              <CardTitle>Current Season ({new Date().getFullYear()})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Championship Standing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Position</span>
                      <span className="font-medium text-lg">{stats.current_season.position}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Points</span>
                      <span className="font-medium text-lg">{stats.current_season.points}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Races</span>
                      <span className="font-medium">{currentSeasonStats?.races || 0}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Wins</span>
                      <span className="font-medium">{stats.current_season.wins}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Podiums</span>
                      <span className="font-medium">{stats.current_season.podiums}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Poles</span>
                      <span className="font-medium">{stats.current_season.poles}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">DNFs</span>
                      <span className="font-medium">{stats.current_season.dnfs}</span>
                    </div>
                  </div>
                </div>
              </div>
              {currentSeasonStats && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Additional Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{currentSeasonStats.best_finish || "-"}</div>
                      <div className="text-sm text-muted-foreground">Best Finish</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{currentSeasonStats.best_grid || "-"}</div>
                      <div className="text-sm text-muted-foreground">Best Grid</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(currentSeasonStats.avg_position || 0)}</div>
                      <div className="text-sm text-muted-foreground">Avg Position</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-seasons" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          <Card>
            <CardHeader>
              <CardTitle>Career Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {allSeasonsStats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary">{allSeasonsStats.races || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Races</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">{allSeasonsStats.wins || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Wins</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">{allSeasonsStats.podiums || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Podiums</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{allSeasonsStats.poles || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Poles</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Career Highlights</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Points</span>
                          <span className="font-medium">{allSeasonsStats.points || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Best Championship</span>
                          <span className="font-medium">{allSeasonsStats.championship_position || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Best Finish</span>
                          <span className="font-medium">{allSeasonsStats.best_finish || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Best Grid</span>
                          <span className="font-medium">{allSeasonsStats.best_grid || "-"}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Performance Averages</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Avg Position</span>
                          <span className="font-medium">{Math.round(allSeasonsStats.avg_position || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Avg Starting Grid</span>
                          <span className="font-medium">{Math.round(allSeasonsStats.avg_starting_grid || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Avg Points/Race</span>
                          <span className="font-medium">{Math.round(allSeasonsStats.avg_points || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total DNFs</span>
                          <span className="font-medium">{allSeasonsStats.dnfs || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Sprint Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className="text-xl font-bold">{allSeasonsStats.sprint_wins || 0}</div>
                        <div className="text-sm text-muted-foreground">Sprint Wins</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className="text-xl font-bold">{allSeasonsStats.sprint_podiums || 0}</div>
                        <div className="text-sm text-muted-foreground">Sprint Podiums</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className="text-xl font-bold">{allSeasonsStats.laps_led || 0}</div>
                        <div className="text-sm text-muted-foreground">Laps Led</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No career statistics available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="season-history" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          <Card>
            <CardHeader>
              <CardTitle>Season by Season</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.seasons.length > 0 ? (
                <div className="space-y-4">
                  {stats.seasons.map((season: any, index: number) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold">{season.year}</div>
                        <div className="text-muted-foreground">{season.team_name || season.team}</div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{season.championship_position || season.position}</div>
                          <div className="text-muted-foreground">Position</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{season.points || season.total_points || 0}</div>
                          <div className="text-muted-foreground">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{season.wins || 0}</div>
                          <div className="text-muted-foreground">Wins</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No season history available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
          <Card>
            <CardHeader>
              <CardTitle>Recent Race Results</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recent_races.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_races.map((race: any, index: number) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <div className="font-medium">{race.name || race.event_name}</div>
                        <div className="text-sm text-muted-foreground">{race.date}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              race.position <= 3
                                ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {race.position}
                          </div>
                          <div className="text-xs text-muted-foreground">Finish</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{race.grid || "-"}</div>
                          <div className="text-xs text-muted-foreground">Grid</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{race.points || 0} pts</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No recent race data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
