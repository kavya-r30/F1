"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Trophy, Flag, Award, TrendingUp } from "lucide-react"
import { compareDrivers, type DriverComparison } from "@/lib/api"
import { DataCard } from "@/components/data-card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataVisualization } from "@/components/data-visualization"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DriverComparisonResults() {
  const searchParams = useSearchParams()
  const [comparison, setComparison] = useState<DriverComparison | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const driver1 = searchParams.get("driver1")
  const driver2 = searchParams.get("driver2")
  const year = searchParams.get("year")

  useEffect(() => {
    async function fetchComparison() {
      if (!driver1 || !driver2 || !year) return

      setLoading(true)
      setError(null)

      try {
        const data = await compareDrivers(driver1, driver2, Number.parseInt(year))
        setComparison(data)
      } catch (err) {
        console.error("Error fetching driver comparison:", err)
        setError("Failed to load driver comparison data")
      } finally {
        setLoading(false)
      }
    }

    fetchComparison()
  }, [driver1, driver2, year])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!comparison) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Select two drivers and a season to compare their performance
          </div>
        </CardContent>
      </Card>
    )
  }

  const { driver1: driver1Data, driver2: driver2Data, head_to_head } = comparison

  const performanceData = [
    {
      stat: "Points",
      [driver1Data.name]: driver1Data.points,
      [driver2Data.name]: driver2Data.points,
    },
    {
      stat: "Wins",
      [driver1Data.name]: driver1Data.wins,
      [driver2Data.name]: driver2Data.wins,
    },
    {
      stat: "Podiums",
      [driver1Data.name]: driver1Data.podiums,
      [driver2Data.name]: driver2Data.podiums,
    },
    {
      stat: "Poles",
      [driver1Data.name]: driver1Data.poles,
      [driver2Data.name]: driver2Data.poles,
    },
    {
      stat: "DNFs",
      [driver1Data.name]: driver1Data.dnfs,
      [driver2Data.name]: driver2Data.dnfs,
    },
  ]

  const averagesData = [
    {
      stat: "Avg Position",
      [driver1Data.name]: driver1Data.avg_position,
      [driver2Data.name]: driver2Data.avg_position,
    },
    {
      stat: "Avg Grid",
      [driver1Data.name]: driver1Data.avg_starting_grid,
      [driver2Data.name]: driver2Data.avg_starting_grid,
    },
    {
      stat: "Avg Points",
      [driver1Data.name]: driver1Data.avg_points,
      [driver2Data.name]: driver2Data.avg_points,
    },
  ]

  const headToHeadData = [
    {
      category: "Race Finishes",
      [driver1Data.name]: head_to_head.races[driver1],
      [driver2Data.name]: head_to_head.races[driver2],
    },
    {
      category: "Qualifying",
      [driver1Data.name]: head_to_head.qualifying[driver1],
      [driver2Data.name]: head_to_head.qualifying[driver2],
    },
  ]

  const radarData = [
    {
      stat: "Points",
      [driver1Data.name]: (driver1Data.points / Math.max(driver1Data.points, driver2Data.points)) * 100,
      [driver2Data.name]: (driver2Data.points / Math.max(driver1Data.points, driver2Data.points)) * 100,
    },
    {
      stat: "Wins",
      [driver1Data.name]: (driver1Data.wins / Math.max(driver1Data.wins, driver2Data.wins, 1)) * 100,
      [driver2Data.name]: (driver2Data.wins / Math.max(driver1Data.wins, driver2Data.wins, 1)) * 100,
    },
    {
      stat: "Podiums",
      [driver1Data.name]: (driver1Data.podiums / Math.max(driver1Data.podiums, driver2Data.podiums, 1)) * 100,
      [driver2Data.name]: (driver2Data.podiums / Math.max(driver1Data.podiums, driver2Data.podiums, 1)) * 100,
    },
    {
      stat: "Poles",
      [driver1Data.name]: (driver1Data.poles / Math.max(driver1Data.poles, driver2Data.poles, 1)) * 100,
      [driver2Data.name]: (driver2Data.poles / Math.max(driver1Data.poles, driver2Data.poles, 1)) * 100,
    },
    {
      stat: "Avg Position",
      [driver1Data.name]:
        ((20 - driver1Data.avg_position) / Math.max(20 - driver1Data.avg_position, 20 - driver2Data.avg_position)) *
        100,
      [driver2Data.name]:
        ((20 - driver2Data.avg_position) / Math.max(20 - driver1Data.avg_position, 20 - driver2Data.avg_position)) *
        100,
    },
  ]

  return (
    <div className="space-y-6 opacity-0 animate-[fadeIn_0.5s_forwards]">
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="head-to-head">Head to Head</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 opacity-0 animate-[fadeIn_0.3s_forwards]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{driver1Data.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <DataCard
                    title="Championship"
                    value={driver1Data.championship_position}
                    suffix={getOrdinal(driver1Data.championship_position)}
                    icon={<Trophy className="h-5 w-5" />}
                  />
                  <DataCard title="Points" value={driver1Data.points} icon={<TrendingUp className="h-5 w-5" />} />
                  <DataCard title="Wins" value={driver1Data.wins} icon={<Flag className="h-5 w-5" />} />
                  <DataCard title="Podiums" value={driver1Data.podiums} icon={<Award className="h-5 w-5" />} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{driver2Data.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <DataCard
                    title="Championship"
                    value={driver2Data.championship_position}
                    suffix={getOrdinal(driver2Data.championship_position)}
                    icon={<Trophy className="h-5 w-5" />}
                  />
                  <DataCard title="Points" value={driver2Data.points} icon={<TrendingUp className="h-5 w-5" />} />
                  <DataCard title="Wins" value={driver2Data.wins} icon={<Flag className="h-5 w-5" />} />
                  <DataCard title="Podiums" value={driver2Data.podiums} icon={<Award className="h-5 w-5" />} />
                </div>
              </CardContent>
            </Card>
          </div>

          <DataVisualization
            title="Performance Comparison"
            type="radar"
            data={radarData}
            dataKeys={[driver1Data.name, driver2Data.name]}
            xAxisKey="stat"
            colors={["#ef4444", "#3b82f6"]}
            height={350}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 opacity-0 animate-[fadeIn_0.3s_forwards]">
          <DataVisualization
            title="Season Performance"
            type="bar"
            data={performanceData}
            dataKeys={[driver1Data.name, driver2Data.name]}
            xAxisKey="stat"
            colors={["#ef4444", "#3b82f6"]}
            height={350}
          />

          <DataVisualization
            title="Average Performance"
            type="bar"
            data={averagesData}
            dataKeys={[driver1Data.name, driver2Data.name]}
            xAxisKey="stat"
            colors={["#ef4444", "#3b82f6"]}
            height={300}
          />
        </TabsContent>

        <TabsContent value="head-to-head" className="space-y-6 opacity-0 animate-[fadeIn_0.3s_forwards]">
          <DataVisualization
            title="Head to Head Comparison"
            description="Number of times each driver finished ahead of the other"
            type="bar"
            data={headToHeadData}
            dataKeys={[driver1Data.name, driver2Data.name]}
            xAxisKey="category"
            colors={["#ef4444", "#3b82f6"]}
            height={300}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Race Finishes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold">
                    {driver1Data.name} {head_to_head.races[driver1]} - {head_to_head.races[driver2]} {driver2Data.name}
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${(head_to_head.races[driver1] / (head_to_head.races[driver1] + head_to_head.races[driver2])) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qualifying</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold">
                    {driver1Data.name} {head_to_head.qualifying[driver1]} - {head_to_head.qualifying[driver2]}{" "}
                    {driver2Data.name}
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${(head_to_head.qualifying[driver1] / (head_to_head.qualifying[driver1] + head_to_head.qualifying[driver2])) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
