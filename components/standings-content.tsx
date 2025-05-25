"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDriverStandings, getConstructorStandings, getSeasons, 
  type DriverStanding, type ConstructorStanding } from "@/lib/api"

export function StandingsContent() {
  const [seasons, setSeasons] = useState<number[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(new Date().getFullYear())
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([])
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([])
  const [activeTab, setActiveTab] = useState("drivers")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const data = await getSeasons()
        setSeasons(data)
        if (data.length > 0 && !data.includes(selectedSeason)) {
          setSelectedSeason(data[0])
        }
      } catch (error) {
        console.error("Failed to fetch seasons:", error)
      }
    }

    fetchSeasons()
  }, [])

  useEffect(() => {
    const fetchStandings = async () => {
      if (!selectedSeason) return

      try {
        setLoading(true)
        const [drivers, constructors] = await Promise.all([
          getDriverStandings(selectedSeason),
          getConstructorStandings(selectedSeason),
        ])

        setDriverStandings(drivers)
        setConstructorStandings(constructors)
      } catch (error) {
        console.error("Failed to fetch standings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [selectedSeason])

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(Number.parseInt(value))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drivers">Driver Standings</TabsTrigger>
            <TabsTrigger value="constructors">Constructor Standings</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem key={season} value={season.toString()}>
                {season} Season
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle>{selectedSeason} Driver Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Pos</TableHead>
                      <TableHead className="w-[80px]">No</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="w-[80px] text-center">Wins</TableHead>
                      <TableHead className="w-[80px] text-center">Podiums</TableHead>
                      <TableHead className="w-[80px] text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverStandings.map((driver) => (
                      <TableRow key={driver.driver_number}>
                        <TableCell className="font-medium">{driver.position}</TableCell>
                        <TableCell>{driver.driver_number}</TableCell>
                        <TableCell>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm text-muted-foreground">{driver.code}</div>
                        </TableCell>
                        <TableCell>{driver.team}</TableCell>
                        <TableCell className="text-center">{driver.wins}</TableCell>
                        <TableCell className="text-center">{driver.podiums}</TableCell>
                        <TableCell className="text-right font-bold">{driver.points}</TableCell>
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
                <CardTitle>{selectedSeason} Constructor Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Pos</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Drivers</TableHead>
                      <TableHead className="w-[80px] text-center">Wins</TableHead>
                      <TableHead className="w-[80px] text-center">Podiums</TableHead>
                      <TableHead className="w-[80px] text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {constructorStandings.map((team) => (
                      <TableRow key={team.team}>
                        <TableCell className="font-medium">{team.position}</TableCell>
                        <TableCell>{team.team}</TableCell>
                        <TableCell>{team.drivers.join(", ")}</TableCell>
                        <TableCell className="text-center">{team.wins}</TableCell>
                        <TableCell className="text-center">{team.podiums}</TableCell>
                        <TableCell className="text-right font-bold">{team.points}</TableCell>
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
