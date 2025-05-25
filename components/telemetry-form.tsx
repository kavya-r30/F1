"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSeasons, getEvents, getDrivers, type Driver } from "@/lib/api"

interface TelemetryFormProps {
  onSubmit?: (data: {
    year: number
    event: string
    driver: string
    lap?: number
    metrics: string[]
  }) => void
}

export function TelemetryForm({ onSubmit }: TelemetryFormProps) {
  const [seasons, setSeasons] = useState<number[]>([])
  const [events, setEvents] = useState<{ round: number; name: string; event_name: string }[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(new Date().getFullYear())
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [selectedLap, setSelectedLap] = useState<string>("")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["speed", "throttle", "brake"])
  const [loading, setLoading] = useState(false)

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
    const fetchDrivers = async () => {
      try {
        setLoading(true)
        const data = await getDrivers(selectedSeason)
        setDrivers(data)
        if (data.length > 0 && !selectedDriver) {
          setSelectedDriver(data[0].driver_number)
        }
      } catch (error) {
        console.error("Failed to fetch drivers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [])

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(Number.parseInt(value))
    setSelectedEvent("")
  }

  const handleEventChange = (value: string) => {
    setSelectedEvent(value)
  }

  const handleDriverChange = (value: string) => {
    setSelectedDriver(value)
  }

  const handleLapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLap(e.target.value)
  }

  const handleMetricChange = (metric: string, checked: boolean) => {
    if (checked) {
      setSelectedMetrics((prev) => [...prev, metric])
    } else {
      setSelectedMetrics((prev) => prev.filter((m) => m !== metric))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (onSubmit && selectedSeason && selectedEvent && selectedDriver) {
      onSubmit({
        year: selectedSeason,
        event: selectedEvent,
        driver: selectedDriver,
        lap: selectedLap ? Number.parseInt(selectedLap) : undefined,
        metrics: selectedMetrics,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telemetry Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="season">Season</Label>
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
            <Label htmlFor="event">Event</Label>
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
            <Label htmlFor="driver">Driver</Label>
            <Select
              value={selectedDriver}
              onValueChange={handleDriverChange}
              disabled={loading || drivers.length === 0}
            >
              <SelectTrigger id="driver">
                <SelectValue placeholder="Select Driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.driver_number} value={driver.driver_number}>
                    {driver.name} ({driver.team_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lap">Lap Number (Optional)</Label>
            <Input
              id="lap"
              type="number"
              placeholder="Leave empty for fastest lap"
              value={selectedLap}
              onChange={handleLapChange}
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Metrics to Display</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="speed"
                  checked={selectedMetrics.includes("speed")}
                  onCheckedChange={(checked) => handleMetricChange("speed", checked as boolean)}
                />
                <Label htmlFor="speed" className="cursor-pointer">
                  Speed
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="throttle"
                  checked={selectedMetrics.includes("throttle")}
                  onCheckedChange={(checked) => handleMetricChange("throttle", checked as boolean)}
                />
                <Label htmlFor="throttle" className="cursor-pointer">
                  Throttle
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="brake"
                  checked={selectedMetrics.includes("brake")}
                  onCheckedChange={(checked) => handleMetricChange("brake", checked as boolean)}
                />
                <Label htmlFor="brake" className="cursor-pointer">
                  Brake
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gear"
                  checked={selectedMetrics.includes("gear")}
                  onCheckedChange={(checked) => handleMetricChange("gear", checked as boolean)}
                />
                <Label htmlFor="gear" className="cursor-pointer">
                  Gear
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rpm"
                  checked={selectedMetrics.includes("rpm")}
                  onCheckedChange={(checked) => handleMetricChange("rpm", checked as boolean)}
                />
                <Label htmlFor="rpm" className="cursor-pointer">
                  RPM
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="drs"
                  checked={selectedMetrics.includes("drs")}
                  onCheckedChange={(checked) => handleMetricChange("drs", checked as boolean)}
                />
                <Label htmlFor="drs" className="cursor-pointer">
                  DRS
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!selectedSeason || !selectedEvent || !selectedDriver}>
            Load Telemetry Data
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
