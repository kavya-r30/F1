"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getRacePositions, type RacePositionData } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Minus, Trophy, Target } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PositionChange {
  driver: string
  driver_name: string
  team: string
  team_color: string
  starting_position: number
  finishing_position: number
  positions_gained: number
  best_position: number
  worst_position: number
}

export function RacePositionVisualization() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [positionData, setPositionData] = useState<RacePositionData | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [positionChanges, setPositionChanges] = useState<PositionChange[]>([])

  const year = searchParams.get("year")
  const event = searchParams.get("event")

  const hasRequiredParams = year && event

  useEffect(() => {
    async function fetchPositions() {
      if (!hasRequiredParams) return

      try {
        setLoading(true)
        setError(null)

        const data = await getRacePositions(Number.parseInt(year), event)
        setPositionData(data)
        const processedChartData = processChartData(data)
        setChartData(processedChartData)
        const changes = calculatePositionChanges(data)
        setPositionChanges(changes)
      } catch (error) {
        console.error("Error fetching race positions:", error)
        setError("Failed to load race position data. Please try different parameters.")
      } finally {
        setLoading(false)
      }
    }

    fetchPositions()
  }, [year, event, hasRequiredParams])

  const processChartData = (data: RacePositionData) => {
    if (!data.race_positions) return []

    const allLaps = new Set<number>()
    Object.values(data.race_positions).forEach((driver) => {
      driver.positions.forEach((pos) => allLaps.add(pos.lap))
    })

    const sortedLaps = Array.from(allLaps).sort((a, b) => a - b)

    return sortedLaps.map((lap) => {
      const lapData: any = { lap }

      Object.values(data.race_positions).forEach((driver) => {
        const positionAtLap = driver.positions.find((p) => p.lap === lap)
        if (positionAtLap) {
          lapData[driver.abbreviation] = positionAtLap.position
        }
      })

      return lapData
    })
  }

  const calculatePositionChanges = (data: RacePositionData): PositionChange[] => {
    if (!data.race_positions) return []

    return Object.values(data.race_positions)
      .map((driver) => {
        const positions = driver.positions.sort((a, b) => a.lap - b.lap)
        const startingPosition = positions[0]?.position || 20
        const finishingPosition = positions[positions.length - 1]?.position || 20
        const allPositions = positions.map((p) => p.position)

        return {
          driver: driver.driver,
          driver_name: driver.driver_name,
          team: driver.team,
          team_color: driver.team_color,
          starting_position: startingPosition,
          finishing_position: finishingPosition,
          positions_gained: startingPosition - finishingPosition,
          best_position: Math.min(...allPositions),
          worst_position: Math.max(...allPositions),
        }
      })
      .sort((a, b) => b.positions_gained - a.positions_gained)
  }

  const getPositionIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getPositionBadge = (change: number) => {
    if (change > 0)
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          +{change}
        </Badge>
      )
    if (change < 0) return <Badge variant="destructive">{change}</Badge>
    return <Badge variant="secondary">0</Badge>
  }

  const generateColors = () => {
    if (!positionData) return []
    return Object.values(positionData.race_positions).map(
      (driver) => driver.team_color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    )
  }

  if (!hasRequiredParams) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Race Selected</h3>
            <p className="text-muted-foreground">
              Please select a season and Grand Prix to view race position analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[600px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2 text-red-500">Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {positionData?.event} {positionData?.year} - Position Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart">Position Chart</TabsTrigger>
              <TabsTrigger value="changes">Position Changes</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-6">
              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="lap" 
                      label={{ value: "Lap", position: "insideBottom", offset: -5 }} 
                    />
                    <YAxis
                      domain={[1, 20]}
                      interval="preserveStartEnd"
                      tickCount={10}
                      reversed
                      label={{ value: "Position", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      labelFormatter={(value) => `Lap ${value}`}
                      formatter={(value: any, name: string) => [value, name]}
                    />
                    <Legend />
                    {positionData &&
                      Object.values(positionData.race_positions).map((driver, index) => (
                        <Line
                          key={driver.driver}
                          type="monotone"
                          dataKey={driver.abbreviation}
                          stroke={
                            driver.team_color ||
                            `hsl(${(index * 360) / Object.keys(positionData.race_positions).length}, 70%, 50%)`
                          }
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          connectNulls={false}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="changes" className="mt-6">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>Finish</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Best</TableHead>
                      <TableHead>Worst</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positionChanges.map((change) => (
                      <TableRow key={change.driver}>
                        <TableCell className="font-medium">{change.driver_name}</TableCell>
                        <TableCell>{change.team}</TableCell>
                        <TableCell>{change.starting_position}</TableCell>
                        <TableCell>{change.finishing_position}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPositionIcon(change.positions_gained)}
                            {getPositionBadge(change.positions_gained)}
                          </div>
                        </TableCell>
                        <TableCell>{change.best_position}</TableCell>
                        <TableCell>{change.worst_position}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-600">Most Positions Gained</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {positionChanges.length > 0 && positionChanges[0].positions_gained > 0 ? (
                      <div>
                        <p className="text-2xl font-bold">{positionChanges[0].driver_name}</p>
                        <p className="text-sm text-muted-foreground">{positionChanges[0].team}</p>
                        <p className="text-lg font-semibold text-green-600">
                          +{positionChanges[0].positions_gained} positions
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No significant gains</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-600">Most Positions Lost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {positionChanges.length > 0 && positionChanges[positionChanges.length - 1].positions_gained < 0 ? (
                      <div>
                        <p className="text-2xl font-bold">{positionChanges[positionChanges.length - 1].driver_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {positionChanges[positionChanges.length - 1].team}
                        </p>
                        <p className="text-lg font-semibold text-red-600">
                          {positionChanges[positionChanges.length - 1].positions_gained} positions
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No significant losses</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{positionChanges.length}</p>
                    <p className="text-sm text-muted-foreground">Drivers in race</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
