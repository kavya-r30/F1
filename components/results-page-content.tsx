"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRaceResults, getSeasons, getEvents, type RaceResult } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ResultsPageContent() {
  const [seasons, setSeasons] = useState<number[]>([])
  const [events, setEvents] = useState<{ round: number; name: string; event_name: string }[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(new Date().getFullYear())
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [raceResults, setRaceResults] = useState<RaceResult | null>(null)
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
    const fetchEvents = async () => {
      if (!selectedSeason) return

      try {
        setLoading(true)
        const data = await getEvents(selectedSeason)
        setEvents(data)
        if (data.length > 0 && !selectedEvent) {
          setSelectedEvent(data[0].name)
        }
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [selectedSeason])

  useEffect(() => {
    const fetchRaceResults = async () => {
      if (!selectedSeason || !selectedEvent) return

      try {
        setLoading(true)
        const data = await getRaceResults(selectedSeason, selectedEvent)
        setRaceResults(data)
      } catch (error) {
        console.error("Failed to fetch race results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRaceResults()
  }, [selectedSeason, selectedEvent])

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(Number.parseInt(value))
    setSelectedEvent("")
  }

  const handleEventChange = (value: string) => {
    setSelectedEvent(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
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

          <Select value={selectedEvent} onValueChange={handleEventChange} disabled={events.length === 0}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.name} value={event.name}>
                  {event.event_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-[500px] w-full" />
      ) : raceResults ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>
                {selectedSeason} {raceResults.event} - Race Results
              </span>
              <Badge variant="outline" className="ml-2">
                {raceResults.date}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Pos</TableHead>
                  <TableHead className="w-[80px]">No</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="w-[80px]">Grid</TableHead>
                  <TableHead className="w-[100px]">Time/Status</TableHead>
                  <TableHead className="w-[80px] text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {raceResults.results.map((result) => (
                  <TableRow key={result.driver_number}>
                    <TableCell className="font-medium">{result.position}</TableCell>
                    <TableCell>{result.driver_number}</TableCell>
                    <TableCell>
                      <div className="font-medium">{result.driver_name}</div>
                      <div className="text-sm text-muted-foreground">{result.driver_code}</div>
                    </TableCell>
                    <TableCell>{result.team}</TableCell>
                    <TableCell>{result.grid}</TableCell>
                    <TableCell>{result.status === "Finished" ? result.time : result.status}</TableCell>
                    <TableCell className="text-right">{result.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Select a season and event to view race results</p>
        </div>
      )}
    </div>
  )
}
