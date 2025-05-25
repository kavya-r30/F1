"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSessionResults, getQualifyingResults, getSprintResults, getSprintQualifyingResults, 
  getSeasons, getEvents, type SessionResult, type RaceResult,} from "@/lib/api"
import { AlertCircle } from "lucide-react"

export function SessionsPageContent() {
  const [seasons, setSeasons] = useState<number[]>([])
  const [events, setEvents] = useState<{ round: number; name: string; event_name: string; sessions: any }[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(new Date().getFullYear())
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [selectedSession, setSelectedSession] = useState<string>("qualifying")
  const [sessionResults, setSessionResults] = useState<SessionResult | RaceResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingResults, setFetchingResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultType, setResultType] = useState<"session" | "race">("session")

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setLoading(true)
        const data = await getSeasons()
        setSeasons(data)
        if (data.length > 0 && !data.includes(selectedSeason)) {
          setSelectedSeason(data[0])
        }
      } catch (error) {
        console.error("Failed to fetch seasons:", error)
        setError("Failed to fetch seasons. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSeasons()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedSeason) return

      try {
        setLoading(true)
        setError(null)
        const data = await getEvents(selectedSeason)
        setEvents(data)
        if (data.length > 0 && !selectedEvent) {
          setSelectedEvent(data[0].name)
        }
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setError("Failed to fetch events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [selectedSeason])

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(Number.parseInt(value))
    setSelectedEvent("")
    setSessionResults(null)
  }

  const handleEventChange = (value: string) => {
    setSelectedEvent(value)
    setSessionResults(null)
  }

  const handleSessionChange = (value: string) => {
    setSelectedSession(value)
    setSessionResults(null)
  }

  const fetchSessionResults = async () => {
    if (!selectedSeason || !selectedEvent || !selectedSession) return

    try {
      setFetchingResults(true)
      setError(null)

      if (selectedSession === "qualifying") {
        const data = await getQualifyingResults(selectedSeason, selectedEvent)
        setSessionResults(data)
        setResultType("session")
      } else if (selectedSession === "sprint") {
        const data = await getSprintResults(selectedSeason, selectedEvent)
        setSessionResults(data)
        setResultType("race")
      } else if (selectedSession === "sprint_qualifying") {
        const data = await getSprintQualifyingResults(selectedSeason, selectedEvent)
        setSessionResults(data)
        setResultType("session")
      } else {
        const data = await getSessionResults(selectedSeason, selectedEvent, selectedSession)
        setSessionResults(data)
        setResultType("session")
      }
    } catch (error) {
      console.error(`Failed to fetch ${selectedSession} results:`, error)
      setError(
        `Failed to fetch ${selectedSession} results. This session might not be available for the selected event.`,
      )
      setSessionResults(null)
    } finally {
      setFetchingResults(false)
    }
  }

  const renderSessionTable = () => {
    if (!sessionResults) return null

    if (resultType === "session") {
      const sessionData = sessionResults as SessionResult

      if (selectedSession === "qualifying" || selectedSession === "sprint_qualifying") {
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Pos</TableHead>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Q1</TableHead>
                <TableHead>Q2</TableHead>
                <TableHead>Q3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionData.results.map((result) => (
                <TableRow key={result.driver_number}>
                  <TableCell className="font-medium">{result.position}</TableCell>
                  <TableCell>{result.driver_number}</TableCell>
                  <TableCell>
                    <div className="font-medium">{result.driver_name}</div>
                    <div className="text-sm text-muted-foreground">{result.driver_code}</div>
                  </TableCell>
                  <TableCell>{result.team}</TableCell>
                  <TableCell>{result.q1 || "-"}</TableCell>
                  <TableCell>{result.q2 || "-"}</TableCell>
                  <TableCell>{result.q3 || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Pos</TableHead>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="w-[80px]">Laps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionData.results.map((result) => (
              <TableRow key={result.driver_number}>
                <TableCell className="font-medium">{result.position}</TableCell>
                <TableCell>{result.driver_number}</TableCell>
                <TableCell>
                  <div className="font-medium">{result.driver_name}</div>
                  <div className="text-sm text-muted-foreground">{result.driver_code}</div>
                </TableCell>
                <TableCell>{result.team}</TableCell>
                <TableCell>{result.time || "-"}</TableCell>
                <TableCell>{result.laps || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    } else {
      const raceData = sessionResults as RaceResult

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Pos</TableHead>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="w-[80px]">Grid</TableHead>
              <TableHead>Time/Status</TableHead>
              <TableHead className="w-[80px]">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {raceData.results.map((result) => (
              <TableRow key={result.driver_number}>
                <TableCell className="font-medium">{result.position}</TableCell>
                <TableCell>{result.driver_number}</TableCell>
                <TableCell>
                  <div className="font-medium">{result.driver_name}</div>
                  <div className="text-sm text-muted-foreground">{result.driver_code}</div>
                </TableCell>
                <TableCell>{result.team}</TableCell>
                <TableCell>{result.grid}</TableCell>
                <TableCell>{result.time || result.status}</TableCell>
                <TableCell>{result.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }
  }

  const getSessionName = (code: string) => {
    const sessionMap: Record<string, string> = {
      fp1: "Practice 1",
      fp2: "Practice 2",
      fp3: "Practice 3",
      qualifying: "Qualifying",
      sprint: "Sprint Race",
      sprint_qualifying: "Sprint Qualifying",
    }
    return sessionMap[code] || code.toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Selector</CardTitle>
          <CardDescription>Select a season, event, and session type to view results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor="season" className="text-sm font-medium">
                Season
              </label>
              <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange} disabled={loading}>
                <SelectTrigger id="season">
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

            <div className="space-y-2">
              <label htmlFor="event" className="text-sm font-medium">
                Event
              </label>
              <Select value={selectedEvent} onValueChange={handleEventChange} disabled={loading || events.length === 0}>
                <SelectTrigger id="event">
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

            <div className="space-y-2">
              <label htmlFor="session" className="text-sm font-medium">
                Session Type
              </label>
              <Select value={selectedSession} onValueChange={handleSessionChange} disabled={loading || !selectedEvent}>
                <SelectTrigger id="session">
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fp1">Practice 1</SelectItem>
                  <SelectItem value="fp2">Practice 2</SelectItem>
                  <SelectItem value="fp3">Practice 3</SelectItem>
                  <SelectItem value="qualifying">Qualifying</SelectItem>
                  <SelectItem value="sprint_qualifying">Sprint Qualifying</SelectItem>
                  <SelectItem value="sprint">Sprint Race</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={fetchSessionResults}
            disabled={loading || fetchingResults || !selectedSeason || !selectedEvent || !selectedSession}
            className="w-full"
          >
            {fetchingResults ? "Loading..." : "View Session Results"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {fetchingResults ? (
        <Skeleton className="h-[500px] w-full" />
      ) : sessionResults ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center flex-wrap gap-2">
              <span>
                {selectedSeason} {sessionResults.event} - {getSessionName(selectedSession)} Results
              </span>
              <Badge variant="outline">{sessionResults.date}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">{renderSessionTable()}</CardContent>
        </Card>
      ) : null}

      {!fetchingResults && !sessionResults && !error && (
        <Card className="bg-muted/40">
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Select a season, event, and session type, then click "View Session Results"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
