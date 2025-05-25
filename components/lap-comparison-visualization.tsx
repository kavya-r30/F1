"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { compareLaps, type LapComparison } from "@/lib/api"
import { DataVisualization } from "@/components/data-visualization"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LapComparisonVisualization() {
  const searchParams = useSearchParams()
  const [comparisonData, setComparisonData] = useState<LapComparison | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const year = searchParams.get("year")
  const event = searchParams.get("event")
  const driversParam = searchParams.get("drivers")
  const lapNumbersParam = searchParams.get("lap_numbers")

  useEffect(() => {
    async function fetchLapComparison() {
      if (!year || !event || !driversParam) return

      setLoading(true)
      setError(null)

      try {
        const drivers = driversParam.split(",")
        const lapNumbers = lapNumbersParam ? lapNumbersParam.split(",").map(Number) : undefined

        const data = await compareLaps(Number.parseInt(year), event, drivers, lapNumbers)
        setComparisonData(data)
      } catch (err) {
        console.error("Error fetching lap comparison:", err)
        setError("Failed to load lap comparison data")
      } finally {
        setLoading(false)
      }
    }

    fetchLapComparison()
  }, [year, event, driversParam, lapNumbersParam])

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

  if (!comparisonData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Select a year, event, and drivers to compare lap times
          </div>
        </CardContent>
      </Card>
    )
  }

  const lapTimeData = comparisonData.driver_data.map((driver) => ({
    driver: driver.driver_name,
    lapTime: parseLapTime(driver.lap_time),
    color: driver.color,
  }))

  const sectorData = comparisonData.driver_data.map((driver) => ({
    driver: driver.driver_name,
    sector1: parseSectorTime(driver.telemetry_data.sector_1_time),
    sector2: parseSectorTime(driver.telemetry_data.sector_2_time),
    sector3: parseSectorTime(driver.telemetry_data.sector_3_time),
    color: driver.color,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lap Comparison: {comparisonData.event}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lap-times">
            <TabsList className="mb-4">
              <TabsTrigger value="lap-times">Lap Times</TabsTrigger>
              <TabsTrigger value="sectors">Sector Times</TabsTrigger>
              <TabsTrigger value="details">Lap Details</TabsTrigger>
            </TabsList>

            <TabsContent value="lap-times">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparisonData.driver_data.map((driver) => (
                    <Card key={driver.driver}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{driver.driver_name}</div>
                            <div className="text-sm text-muted-foreground">{driver.team}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{formatTime(parseLapTime(driver.lap_time))}</div>
                            <div className="text-sm text-muted-foreground">Lap {driver.lap_number}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <DataVisualization
                  title="Lap Time Comparison"
                  type="bar"
                  data={lapTimeData}
                  dataKeys={["lapTime"]}
                  xAxisKey="driver"
                  colors={lapTimeData.map((d) => d.color)}
                  height={300}
                  formatter={(value: number) => formatTime(value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="sectors">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataVisualization
                    title="Sector 1"
                    type="bar"
                    data={sectorData}
                    dataKeys={["sector1"]}
                    xAxisKey="driver"
                    colors={sectorData.map((d) => d.color)}
                    height={250}
                    formatter={(value: number) => formatTime(value)}
                  />

                  <DataVisualization
                    title="Sector 2"
                    type="bar"
                    data={sectorData}
                    dataKeys={["sector2"]}
                    xAxisKey="driver"
                    colors={sectorData.map((d) => d.color)}
                    height={250}
                    formatter={(value: number) => formatTime(value)}
                  />

                  <DataVisualization
                    title="Sector 3"
                    type="bar"
                    data={sectorData}
                    dataKeys={["sector3"]}
                    xAxisKey="driver"
                    colors={sectorData.map((d) => d.color)}
                    height={250}
                    formatter={(value: number) => formatTime(value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparisonData.driver_data.map((driver) => (
                    <Card key={driver.driver}>
                      <CardHeader>
                        <CardTitle>{driver.driver_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Lap Number</div>
                              <div className="font-medium">{driver.lap_number}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Lap Time</div>
                              <div className="font-medium">{formatTime(parseLapTime(driver.lap_time))}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Sector 1</div>
                              <div className="font-medium">
                                {formatTime(parseSectorTime(driver.telemetry_data.sector_1_time))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Sector 2</div>
                              <div className="font-medium">
                                {formatTime(parseSectorTime(driver.telemetry_data.sector_2_time))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Sector 3</div>
                              <div className="font-medium">
                                {formatTime(parseSectorTime(driver.telemetry_data.sector_3_time))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Compound</div>
                              <div className="font-medium">{driver.telemetry_data.compound || "Unknown"}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Tyre Life</div>
                              <div className="font-medium">{driver.telemetry_data.tyre_life || 0} laps</div>
                            </div>
                          </div>
                        </div>
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

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "N/A"

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = (seconds % 60).toFixed(3)
  return `${minutes}:${remainingSeconds.padStart(6, "0")}`
}

function parseLapTime(timeStr: any): number {
  if (!timeStr) return 0

  if (typeof timeStr === "string" && timeStr.includes("days")) {
    const match = timeStr.match(/\d{2}:\d{2}:(\d{2}\.\d+)/)
    if (match && match[1]) {
      return Number.parseFloat(match[1])
    }

    const timeMatch = timeStr.match(/\d{2}:(\d{2}):(\d{2}\.\d+)/)
    if (timeMatch && timeMatch[1] && timeMatch[2]) {
      const minutes = Number.parseInt(timeMatch[1], 10)
      const seconds = Number.parseFloat(timeMatch[2])
      return minutes * 60 + seconds
    }
  }

  if (typeof timeStr === "string") {
    const parts = timeStr.split(":")
    if (parts.length === 2) {
      const minutes = Number.parseInt(parts[0], 10)
      const seconds = Number.parseFloat(parts[1])
      return minutes * 60 + seconds
    }
  }

  if (typeof timeStr === "number") {
    return timeStr
  }
  return Number.parseFloat(timeStr) || 0
}

function parseSectorTime(timeStr: any): number {
  if (!timeStr) return 0
  if (typeof timeStr === "string" && timeStr.includes("days")) {
    const match = timeStr.match(/\d{2}:\d{2}:(\d{2}\.\d+)/)
    if (match && match[1]) {
      return Number.parseFloat(match[1])
    }
  }
  if (typeof timeStr === "string") {
    const parts = timeStr.split(":")
    if (parts.length === 2) {
      const minutes = Number.parseInt(parts[0], 10)
      const seconds = Number.parseFloat(parts[1])
      return minutes * 60 + seconds
    }
  }
  if (typeof timeStr === "number") {
    return timeStr
  }
  return Number.parseFloat(timeStr) || 0
}
