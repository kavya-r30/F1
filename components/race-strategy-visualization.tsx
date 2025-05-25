"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getRaceStrategy, type RaceStrategy } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RaceStrategyVisualization() {
  const searchParams = useSearchParams()
  const [strategyData, setStrategyData] = useState<RaceStrategy | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const year = searchParams.get("year")
  const event = searchParams.get("event")

  useEffect(() => {
    async function fetchRaceStrategy() {
      if (!year || !event) return
      setLoading(true)
      setError(null)

      try {
        const data = await getRaceStrategy(Number.parseInt(year), event)
        setStrategyData(data)
      } catch (err) {
        console.error("Error fetching race strategy:", err)
        setError("Failed to load race strategy data")
      } finally {
        setLoading(false)
      }
    }

    fetchRaceStrategy()
  }, [year, event])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[500px] animate-pulse bg-muted rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!strategyData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Select a year and event to view race strategy data</div>
        </CardContent>
      </Card>
    )
  }

  const sortedDrivers = Object.values(strategyData.race_strategies).sort(
    (a, b) => (a.finish_position || 999) - (b.finish_position || 999),
  )

  return (
    <div className="space-y-6 opacity-0 animate-[fadeIn_0.5s_forwards]">
      <Card>
        <CardHeader>
          <CardTitle>Race Strategy: {strategyData.event}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="strategy">
            <TabsList className="mb-4">
              <TabsTrigger value="strategy">Strategy Timeline</TabsTrigger>
              <TabsTrigger value="pit-stops">Pit Stops</TabsTrigger>
              <TabsTrigger value="stints">Stint Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="strategy" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
              <div className="space-y-4">
                {sortedDrivers.map((driver) => (
                  <div key={driver.driver} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: driver.team_color }}></div>
                        <span className="font-medium">{driver.driver_name}</span>
                        <span className="text-sm text-muted-foreground">({driver.team})</span>
                      </div>
                      <div className="text-sm">
                        P{driver.finish_position || "DNF"} - {driver.total_pit_stops} stops
                      </div>
                    </div>

                    <div className="relative h-8 bg-muted rounded-md overflow-hidden">
                      {driver.stints.map((stint, index) => {
                        const totalLaps = driver.stints.reduce((acc, s) => acc + s.laps, 0)
                        const width = (stint.laps / totalLaps) * 100
                        const compoundColor = getCompoundColor(stint.compound)

                        return (
                          <div
                            key={index}
                            className="absolute top-0 bottom-0 flex items-center justify-center text-xs font-medium text-white"
                            style={{
                              left: `${driver.stints
                                .slice(0, index)
                                .reduce((acc, s) => acc + (s.laps / totalLaps) * 100, 0)}%`,
                              width: `${width}%`,
                              backgroundColor: compoundColor,
                            }}
                          >
                            {width > 10 && stint.compound}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Lap 1</span>
                      <span>Lap {driver.stints.reduce((acc, stint) => acc + stint.laps, 0)}</span>
                    </div>
                  </div>
                ))}

                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge className="bg-red-600">Soft</Badge>
                  <Badge className="bg-yellow-500">Medium</Badge>
                  <Badge className="bg-slate-200 text-black border">Hard</Badge>
                  <Badge className="bg-green-500">Intermediate</Badge>
                  <Badge className="bg-blue-500">Wet</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pit-stops" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedDrivers.map((driver) => (
                    <Card key={driver.driver}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{driver.driver_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {driver.pit_stops.length > 0 ? (
                          <div className="space-y-2">
                            {driver.pit_stops.map((stop, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">Lap {stop.lap}</span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {stop.new_compound && (
                                      <Badge
                                        className="ml-2"
                                        style={{ backgroundColor: getCompoundColor(stop.new_compound) }}
                                      >
                                        {stop.new_compound}
                                      </Badge>
                                    )}
                                  </span>
                                </div>
                                <div className="text-sm font-medium">{stop.total_pit_time.toFixed(1)}s</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No pit stops</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stints" className="opacity-0 animate-[fadeIn_0.3s_forwards]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedDrivers.map((driver) => (
                    <Card key={driver.driver}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{driver.driver_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Stint</th>
                              <th className="text-left py-2">Compound</th>
                              <th className="text-center py-2">Laps</th>
                              <th className="text-right py-2">Range</th>
                            </tr>
                          </thead>
                          <tbody>
                            {driver.stints.map((stint, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">
                                  <Badge
                                    style={{
                                      backgroundColor: getCompoundColor(stint.compound),
                                    }}
                                  >
                                    {stint.compound}
                                  </Badge>
                                </td>
                                <td className="py-2 text-center">{stint.laps}</td>
                                <td className="py-2 text-right">
                                  {stint.start_lap}-{stint.end_lap}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function getCompoundColor(compound: string): string {
  const compounds: Record<string, string> = {
    SOFT: "#ff0000",
    MEDIUM: "#ffcc00",
    HARD: "#e2e8f0",
    INTERMEDIATE: "#00cc00",
    WET: "#0000ff",
    C1: "#ffffff",
    C2: "#ffffff",
    C3: "#ffcc00",
    C4: "#ffcc00",
    C5: "#ff0000",
  }

  return compounds[compound?.toUpperCase()] || "#cccccc"
}
