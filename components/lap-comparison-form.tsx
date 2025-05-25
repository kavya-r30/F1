"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getEvents, getDrivers } from "@/lib/api"
import { fallbackEvents, fallbackDrivers } from "@/lib/fallback-data"
import { PlusCircle, MinusCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LapComparisonForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [events, setEvents] = useState<any[]>(fallbackEvents)
  const [drivers, setDrivers] = useState<any[]>(fallbackDrivers)
  const [loading, setLoading] = useState(true)

  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || new Date().getFullYear().toString())
  const [selectedEvent, setSelectedEvent] = useState(searchParams.get("event") || "")
  const [selectedSession, setSelectedSession] = useState(searchParams.get("session") || "R")

  const driversParam = searchParams.get("drivers") || ""
  const lapNumbersParam = searchParams.get("lap_numbers") || ""

  const initialDrivers = driversParam ? driversParam.split(",") : [""]
  const initialLapNumbers = lapNumbersParam ? lapNumbersParam.split(",") : [""]

  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(initialDrivers)
  const [selectedLapNumbers, setSelectedLapNumbers] = useState<string[]>(initialLapNumbers)
  const [useFastestLap, setUseFastestLap] = useState<boolean[]>(
    initialLapNumbers.map(() => !initialLapNumbers[0] || initialLapNumbers[0] === "0"),
  )

  const sessionTypes = [
    // { value: "FP1", label: "Practice 1" },
    // { value: "FP2", label: "Practice 2" },
    // { value: "FP3", label: "Practice 3" },
    // { value: "Q", label: "Qualifying" },
    // { value: "S", label: "Sprint" },
    { value: "R", label: "Race" },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2017 }, (_, i) => (2018 + i).toString())

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsData = await getEvents(Number.parseInt(selectedYear))
        if (eventsData.length > 0) setEvents(eventsData)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    if (selectedYear) {
      fetchEvents()
    }
  }, [selectedYear])

  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true)
        const driversData = await getDrivers(Number.parseInt(selectedYear))
        if (driversData.length > 0) {
          setDrivers(driversData)
        } else {
          setDrivers(fallbackDrivers)
        }
      } catch (error) {
        console.error("Error fetching drivers:", error)
        setDrivers(fallbackDrivers)
      } finally {
        setLoading(false)
      }
    }

    if (selectedYear) {
      fetchDrivers()
    }
  }, [selectedYear])

  const addDriverComparison = () => {
    setSelectedDrivers([...selectedDrivers, ""])
    setSelectedLapNumbers([...selectedLapNumbers, ""])
    setUseFastestLap([...useFastestLap, true])
  }

  const removeDriverComparison = (index: number) => {
    if (selectedDrivers.length > 1) {
      const newDrivers = [...selectedDrivers]
      const newLapNumbers = [...selectedLapNumbers]
      const newUseFastestLap = [...useFastestLap]

      newDrivers.splice(index, 1)
      newLapNumbers.splice(index, 1)
      newUseFastestLap.splice(index, 1)

      setSelectedDrivers(newDrivers)
      setSelectedLapNumbers(newLapNumbers)
      setUseFastestLap(newUseFastestLap)
    }
  }

  const updateDriver = (index: number, value: string) => {
    const newDrivers = [...selectedDrivers]
    newDrivers[index] = value
    setSelectedDrivers(newDrivers)
  }

  const updateLapNumber = (index: number, value: string) => {
    const newLapNumbers = [...selectedLapNumbers]
    newLapNumbers[index] = value
    setSelectedLapNumbers(newLapNumbers)
  }

  const toggleFastestLap = (index: number, checked: boolean) => {
    const newUseFastestLap = [...useFastestLap]
    newUseFastestLap[index] = checked
    setUseFastestLap(newUseFastestLap)

    if (checked) {
      const newLapNumbers = [...selectedLapNumbers]
      newLapNumbers[index] = ""
      setSelectedLapNumbers(newLapNumbers)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validDrivers = selectedDrivers.filter((driver) => driver)
    if (validDrivers.length === 0) return

    const params = new URLSearchParams()
    params.set("year", selectedYear)
    params.set("event", selectedEvent)
    params.set("session", selectedSession)

    params.set("drivers", validDrivers.join(","))

    const lapNumbers = selectedLapNumbers.map((lap, index) => (useFastestLap[index] ? "0" : lap))
    params.set("lap_numbers", lapNumbers.join(","))

    router.push(`/lap-comparison?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lap Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear} disabled={loading}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent} disabled={loading || events.length === 0}>
              <SelectTrigger id="event">
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.round} value={event.name}>
                    {event.event_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session">Session</Label>
            <Select value={selectedSession} onValueChange={setSelectedSession} disabled={loading}>
              <SelectTrigger id="session">
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent>
                {sessionTypes.map((session) => (
                  <SelectItem key={session.value} value={session.value}>
                    {session.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Drivers to Compare</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDriverComparison}
                disabled={selectedDrivers.length >= 5}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Driver
              </Button>
            </div>

            {selectedDrivers.map((driver, index) => (
              <div key={index} className="space-y-2 border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`driver-${index}`}>Driver {index + 1}</Label>
                  {selectedDrivers.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeDriverComparison(index)}>
                      <MinusCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <Select
                  value={driver}
                  onValueChange={(value) => updateDriver(index, value)}
                  disabled={loading || drivers.length === 0}
                >
                  <SelectTrigger id={`driver-${index}`}>
                    <SelectValue placeholder="Select Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => (
                      <SelectItem key={`${d.driver_number}-${index}`} value={d.driver_number}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id={`fastest-lap-${index}`}
                    checked={useFastestLap[index]}
                    onCheckedChange={(checked) => toggleFastestLap(index, checked === true)}
                  />
                  <Label htmlFor={`fastest-lap-${index}`} className="text-sm">
                    Use fastest lap
                  </Label>
                </div>

                {!useFastestLap[index] && (
                  <div className="pt-2">
                    <Label htmlFor={`lap-${index}`}>Lap Number</Label>
                    <Input
                      id={`lap-${index}`}
                      type="number"
                      min="1"
                      max="100"
                      value={selectedLapNumbers[index]}
                      onChange={(e) => updateLapNumber(index, e.target.value)}
                      placeholder="Enter lap number"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={loading || !selectedYear || !selectedEvent || !selectedSession || !selectedDrivers[0]}
        >
          Compare Laps
        </Button>
      </CardFooter>
    </Card>
  )
}
