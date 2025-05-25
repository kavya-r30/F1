"use client"

import { useState, useEffect } from "react"
import { getRaceResults, getRaceAnalysis, getQualifyingResults, type RaceResult, 
  type RaceAnalysis, type SessionResult } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DataVisualization } from "@/components/data-visualization"

interface RaceResultsContentProps {
  year: number
  event: string
}

export function RaceResultsContent({ year, event }: RaceResultsContentProps) {
  const [raceResults, setRaceResults] = useState<RaceResult | null>(null)
  const [qualifyingResults, setQualifyingResults] = useState<SessionResult | null>(null)
  const [raceAnalysis, setRaceAnalysis] = useState<RaceAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRaceData() {
      setLoading(true)
      setError(null)
      try {
        const [race, qualifying, analysis] = await Promise.all([
          getRaceResults(year, event),
          getQualifyingResults(year, event).catch(() => null),
          getRaceAnalysis(year, event).catch(() => null),
        ])
        setRaceResults(race)
        setQualifyingResults(qualifying)
        setRaceAnalysis(analysis)
      } catch (err) {
        console.error("Error fetching race data:", err)
        setError("Failed to load race data")
      } finally {
        setLoading(false)
      }
    }

    fetchRaceData()
  }, [year, event])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }

  if (error || !raceResults) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">{error || "No race results found for this event"}</div>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for visualizations
  const positionGainData = raceResults.results
    .filter((result) => result.grid && result.position)
    .map((result) => ({
      name: result.driver_name,
      gain: result.grid - result.position,
    }))
    .sort((a, b) => b.gain - a.gain)

  const pointsData = raceResults.results
    .filter((result) => result.points > 0)
    .map((result) => ({
      name: result.driver_name,
      points: result.points,
    }))

  const pitStopsData =
    raceAnalysis?.pit_stops.map((driver) => ({
      name: driver.driver_name,
      stops: driver.total_stops,
    })) || []

  const overtakesData =
    raceAnalysis?.overtakes.reduce(
      (acc, overtake) => {
        const existingDriver = acc.find((d) => d.name === overtake.driver_name)
        if (existingDriver) {
          existingDriver.overtakes += 1
        } else {
          acc.push({ name: overtake.driver_name, overtakes: 1 })
        }
        return acc
      },
      [] as { name: string; overtakes: number }[],
    ) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {raceResults.event} {year}
        </h1>
        <p className="text-muted-foreground">
          {raceResults.circuit} • {new Date(raceResults.date).toLocaleDateString()}
        </p>
      </div>

      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results">Race Results</TabsTrigger>
          {qualifyingResults && <TabsTrigger value="qualifying">Qualifying</TabsTrigger>}
          {raceAnalysis && <TabsTrigger value="analysis">Race Analysis</TabsTrigger>}
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Race Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Pos</th>
                      <th className="text-left py-3 px-4">Driver</th>
                      <th className="text-left py-3 px-4">Team</th>
                      <th className="text-center py-3 px-4">Grid</th>
                      <th className="text-right py-3 px-4">Time/Status</th>
                      <th className="text-right py-3 px-4">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raceResults.results.map((result, index) => (
                      <tr
                        key={result.driver_number}
                        className="border-b last:border-0 hover:bg-muted/50 opacity-0 animate-fade-in translate-y-2 animate-slide-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-3 px-4 font-medium">{result.position || "DNF"}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{result.driver_name}</div>
                          <div className="text-sm text-muted-foreground">{result.driver_code}</div>
                        </td>
                        <td className="py-3 px-4">{result.team}</td>
                        <td className="py-3 px-4 text-center">{result.grid}</td>
                        <td className="py-3 px-4 text-right">{result.time || result.status}</td>
                        <td className="py-3 px-4 text-right font-medium">{result.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {qualifyingResults && (
          <TabsContent value="qualifying">
            <Card>
              <CardHeader>
                <CardTitle>Qualifying Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Pos</th>
                        <th className="text-left py-3 px-4">Driver</th>
                        <th className="text-left py-3 px-4">Team</th>
                        <th className="text-right py-3 px-4">Q1</th>
                        <th className="text-right py-3 px-4">Q2</th>
                        <th className="text-right py-3 px-4">Q3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualifyingResults.results.map((result, index) => (
                        <tr
                          key={result.driver_number}
                          className="border-b last:border-0 hover:bg-muted/50 opacity-0 animate-fade-in translate-y-2 animate-slide-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="py-3 px-4 font-medium">{result.position}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{result.driver_name}</div>
                            <div className="text-sm text-muted-foreground">{result.driver_code}</div>
                          </td>
                          <td className="py-3 px-4">{result.team}</td>
                          <td className="py-3 px-4 text-right">{result.q1}</td>
                          <td className="py-3 px-4 text-right">{result.q2}</td>
                          <td className="py-3 px-4 text-right">{result.q3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {raceAnalysis && (
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pit Stops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Driver</th>
                          <th className="text-center py-3 px-4">Stops</th>
                          <th className="text-right py-3 px-4">Laps</th>
                        </tr>
                      </thead>
                      <tbody>
                        {raceAnalysis.pit_stops.map((driver, index) => (
                          <tr key={driver.driver_number} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{driver.driver_name}</td>
                            <td className="py-3 px-4 text-center">{driver.total_stops}</td>
                            <td className="py-3 px-4 text-right">{driver.stops.map((stop) => stop.lap).join(", ")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Driver</th>
                          <th className="text-left py-3 px-4">Compound</th>
                          <th className="text-center py-3 px-4">Laps</th>
                          <th className="text-right py-3 px-4">Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {raceAnalysis.stints.flatMap((driver) =>
                          driver.stints.map((stint, i) => (
                            <tr key={`${driver.driver}-${i}`} className="border-b last:border-0 hover:bg-muted/50">
                              {i === 0 && (
                                <td className="py-3 px-4 font-medium" rowSpan={driver.stints.length}>
                                  {driver.driver_name}
                                </td>
                              )}
                              <td className="py-3 px-4">{stint.compound}</td>
                              <td className="py-3 px-4 text-center">{stint.laps}</td>
                              <td className="py-3 px-4 text-right">
                                {stint.start_lap}-{stint.end_lap}
                              </td>
                            </tr>
                          )),
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="visualizations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataVisualization
              title="Position Gains/Losses"
              description="Difference between starting grid and finishing position"
              type="bar"
              data={positionGainData}
              dataKeys={["gain"]}
              xAxisKey="name"
              colors={["#ef4444"]}
              height={350}
            />

            <DataVisualization
              title="Points Distribution"
              type="pie"
              data={pointsData}
              dataKeys={["points"]}
              xAxisKey="name"
              colors={[
                "#ef4444",
                "#f97316",
                "#f59e0b",
                "#eab308",
                "#84cc16",
                "#22c55e",
                "#10b981",
                "#14b8a6",
                "#06b6d4",
                "#0ea5e9",
              ]}
              height={350}
            />

            {pitStopsData.length > 0 && (
              <DataVisualization
                title="Pit Stop Count"
                type="bar"
                data={pitStopsData}
                dataKeys={["stops"]}
                xAxisKey="name"
                colors={["#3b82f6"]}
                height={350}
              />
            )}

            {overtakesData.length > 0 && (
              <DataVisualization
                title="Overtakes"
                type="bar"
                data={overtakesData}
                dataKeys={["overtakes"]}
                xAxisKey="name"
                colors={["#10b981"]}
                height={350}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
