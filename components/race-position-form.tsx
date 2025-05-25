"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getEvents } from "@/lib/api"
import { fallbackEvents } from "@/lib/fallback-data"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, TrendingUp } from "lucide-react"

export function RacePositionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [events, setEvents] = useState<any[]>(fallbackEvents)
  const [loading, setLoading] = useState(true)

  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || new Date().getFullYear().toString())
  const [selectedEvent, setSelectedEvent] = useState(searchParams.get("event") || "")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2017 }, (_, i) => (2018 + i).toString())

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const eventsData = await getEvents(Number.parseInt(selectedYear))
        if (eventsData.length > 0) setEvents(eventsData)
      } catch (error) {
        console.error("Error fetching events, using fallback data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [selectedYear])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedYear || !selectedEvent) return

    const params = new URLSearchParams()
    params.set("year", selectedYear)
    params.set("event", selectedEvent)

    router.push(`/positions?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Position Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Season</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear} disabled={loading}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select Season" />
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
            <Label htmlFor="event">Grand Prix</Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent} disabled={loading || events.length === 0}>
              <SelectTrigger id="event">
                <SelectValue placeholder="Select Grand Prix" />
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
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full" disabled={loading || !selectedYear || !selectedEvent}>
          Analyze Race Positions
        </Button>
      </CardFooter>
    </Card>
  )
}
