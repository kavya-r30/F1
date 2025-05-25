"use client"

import { useState, useEffect } from "react"
import { getDriverStandings, getConstructorStandings, getSeasons } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { DataVisualization } from "@/components/data-visualization"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ChampionshipPageContent() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [seasons, setSeasons] = useState<number[]>([])
  const [driverStandings, setDriverStandings] = useState<any[]>([])
  const [constructorStandings, setConstructorStandings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSeasons() {
      try {
        const data = await getSeasons()
        setSeasons(data)
      } catch (err) {
        console.error("Error fetching seasons:", err)
      }
    }

    fetchSeasons()
  }, [])

  useEffect(() => {
    async function fetchChampionshipData() {
      setLoading(true)
      setError(null)
      try {
        const [drivers, constructors] = await Promise.all([getDriverStandings(year), getConstructorStandings(year)])
        setDriverStandings(drivers)
        setConstructorStandings(constructors)
      } catch (err) {
        console.error("Error fetching championship data:", err)
        setError("Failed to load championship data")
      } finally {
        setLoading(false)
      }
    }

    fetchChampionshipData()
  }, [year])

  const driverPointsData = driverStandings
    .slice(0, 10)
    .map((driver) => ({
      name: driver.name,
      points: driver.points,
    }))
    .reverse()

  const constructorPointsData = constructorStandings
    .slice(0, 10)
    .map((team) => ({
      name: team.team,
      points: team.points,
    }))
    .reverse()
  const valueFormatter = (value: number) => `${value} pts`

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Championship History</h2>
        <Select value={year.toString()} onValueChange={(value) => setYear(Number.parseInt(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {seasons.length > 0
              ? seasons.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y} Season
                  </SelectItem>
                ))
              : Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y} Season
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
            <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
          </div>
          <div className="h-[400px] animate-pulse bg-muted rounded-lg" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">{error}</div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="visualizations">
          <TabsList className="mb-6">
            <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
            <TabsTrigger value="drivers">Driver Standings</TabsTrigger>
            <TabsTrigger value="constructors">Constructor Standings</TabsTrigger>
          </TabsList>

          <TabsContent value="visualizations">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="opacity-0 animate-fade-in -translate-x-5 animate-slide-in-right">
                  <DataVisualization
                    title="Driver Championship Points"
                    type="bar"
                    data={driverPointsData}
                    dataKeys={["points"]}
                    xAxisKey="name"
                    colors={["#ef4444"]}
                    height={400}
                    formatter={valueFormatter}
                  />
                </div>

                <div className="opacity-0 animate-fade-in translate-x-5 animate-slide-in-left">
                  <DataVisualization
                    title="Constructor Championship Points"
                    type="bar"
                    data={constructorPointsData}
                    dataKeys={["points"]}
                    xAxisKey="name"
                    colors={["#3b82f6"]}
                    height={400}
                    formatter={valueFormatter}
                  />
                </div>
              </div>

              <div
                className="opacity-0 animate-fade-in translate-y-5 animate-slide-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{year} Championship Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Driver Champion</h3>
                        {driverStandings.length > 0 ? (
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                              {driverStandings[0].code}
                            </div>
                            <div>
                              <p className="font-bold text-lg">{driverStandings[0].name}</p>
                              <p className="text-muted-foreground">{driverStandings[0].team}</p>
                            </div>
                            <div className="ml-auto">
                              <Badge className="text-lg px-3 py-1">{driverStandings[0].points} pts</Badge>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No data available</p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Constructor Champion</h3>
                        {constructorStandings.length > 0 ? (
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                              {constructorStandings[0].team.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-lg">{constructorStandings[0].team}</p>
                              <p className="text-muted-foreground">
                                {Array.isArray(constructorStandings[0].drivers)
                                  ? constructorStandings[0].drivers.join(", ")
                                  : ""}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <Badge className="text-lg px-3 py-1">{constructorStandings[0].points} pts</Badge>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No data available</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle>{year} Driver Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pos</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="text-right">Wins</TableHead>
                      <TableHead className="text-right">Podiums</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverStandings.map((driver, index) => (
                      <TableRow
                        key={driver.driver_number}
                        className="hover:bg-muted/50 opacity-0 animate-fade-in translate-y-2 animate-slide-in-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <TableCell className="font-medium">{driver.position}</TableCell>
                        <TableCell>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-xs text-muted-foreground">{driver.code}</div>
                        </TableCell>
                        <TableCell>{driver.team}</TableCell>
                        <TableCell className="text-right font-medium">{driver.points}</TableCell>
                        <TableCell className="text-right">{driver.wins}</TableCell>
                        <TableCell className="text-right">{driver.podiums}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="constructors">
            <Card>
              <CardHeader>
                <CardTitle>{year} Constructor Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pos</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Drivers</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="text-right">Wins</TableHead>
                      <TableHead className="text-right">Podiums</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {constructorStandings.map((team, index) => (
                      <TableRow
                        key={team.team}
                        className="hover:bg-muted/50 opacity-0 animate-fade-in translate-y-2 animate-slide-in-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <TableCell className="font-medium">{team.position}</TableCell>
                        <TableCell className="font-medium">{team.team}</TableCell>
                        <TableCell>{Array.isArray(team.drivers) ? team.drivers.join(", ") : ""}</TableCell>
                        <TableCell className="text-right font-medium">{team.points}</TableCell>
                        <TableCell className="text-right">{team.wins}</TableCell>
                        <TableCell className="text-right">{team.podiums}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
