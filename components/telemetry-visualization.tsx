"use client"

import { useState, useEffect } from "react"
import { getTelemetryData, type TelemetryData } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TelemetryVisualizationProps {
  initialData?: {
    year: number
    event: string
    driver: string
    lap?: number
    metrics?: string[]
  }
}

export function TelemetryVisualization({ initialData }: TelemetryVisualizationProps) {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("speed")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData || !initialData.year || !initialData.event || !initialData.driver) {
      setError("Please select year, event, and driver to view telemetry data")
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTelemetryData(
          initialData.year, 
          initialData.event, 
          initialData.driver, 
          initialData.lap
        )
        setTelemetryData(data)
      } catch (error) {
        console.error("Failed to fetch telemetry data:", error)
        setError("Failed to load telemetry data. Please try different parameters.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialData])

  const formatData = () => {
    if (!telemetryData) return []

    return telemetryData.telemetry.distance.map((distance, index) => {
      const formattedData: any = {
        distance,
        speed: telemetryData.telemetry.speed[index],
      }
      if (telemetryData.telemetry.throttle) {
        formattedData.throttle = telemetryData.telemetry.throttle[index]
      }
      if (telemetryData.telemetry.brake) {
        formattedData.brake = telemetryData.telemetry.brake[index]
      }
      if (telemetryData.telemetry.gear) {
        formattedData.gear = telemetryData.telemetry.gear[index]
      }
      if (telemetryData.telemetry.rpm) {
        formattedData.rpm = telemetryData.telemetry.rpm[index]
      }
      if (telemetryData.telemetry.drs) {
        formattedData.drs = telemetryData.telemetry.drs[index]
      }
      return formattedData
    })
  }

  const getYAxisDomain = (metric: string) => {
    switch (metric) {
      case "speed":
        return [0, 400]
      case "throttle":
        return [0, 100]
      case "brake":
        return [0, 1]
      case "gear":
        return [0, 8]
      case "rpm":
        return [0, 15000]
      case "drs":
        return [0, 1]
      default:
        return [0, "auto"]
    }
  }

  const getChartColor = (metric: string) => {
    switch (metric) {
      case "speed":
        return "#3b82f6"
      case "throttle":
        return "#10b981"
      case "brake":
        return "#ef4444"
      case "gear":
        return "#8b5cf6"
      case "rpm":
        return "#f59e0b"
      case "drs":
        return "#06b6d4"
      default:
        return "#3b82f6"
    }
  }

  const formatYAxisTick = (value: number, metric: string) => {
    switch (metric) {
      case "speed":
        return `${value} km/h`
      case "throttle":
      case "brake":
        return `${value}%`
      case "gear":
        return value === 0 ? "N" : value
      case "rpm":
        return `${value}`
      case "drs":
        return value === 1 ? "Open" : "Closed"
      default:
        return value
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telemetry Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telemetry Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!telemetryData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telemetry Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-muted-foreground">Select parameters and load telemetry data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formattedData = formatData()
  const availableMetrics = ["speed"];
  
  if (telemetryData.telemetry.throttle) availableMetrics.push("throttle");
  if (telemetryData.telemetry.brake) availableMetrics.push("brake");
  if (telemetryData.telemetry.gear) availableMetrics.push("gear");
  if (telemetryData.telemetry.rpm) availableMetrics.push("rpm");
  if (telemetryData.telemetry.drs) availableMetrics.push("drs");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span>
            {telemetryData.year} {telemetryData.event} - {telemetryData.driver} Telemetry
          </span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Lap: {telemetryData.lap}</Badge>
            <Badge variant="outline">Lap Time: {(telemetryData.lap_time / 1000).toFixed(3)}s</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6">
            {availableMetrics.map(metric => (
              <TabsTrigger key={metric} value={metric}>
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {availableMetrics.map(metric => (
            <TabsContent key={metric} value={metric} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="distance"
                    type="number"
                    label={{ value: "Distance (m)", position: "insideBottomRight", offset: -5 }}
                    tickFormatter={(value) => Math.round(value)}
                    tickCount={10}
                    domain={[0, "dataMax"]}
                  />
                  <YAxis 
                    domain={getYAxisDomain(metric)} 
                    tickFormatter={(value) => formatYAxisTick(value, metric)} 
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatYAxisTick(value, metric),
                      metric.charAt(0).toUpperCase() + metric.slice(1),
                    ]}
                    labelFormatter={(label) => `Distance: ${label}m`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={metric}
                    stroke={getChartColor(metric)}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
