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

export function RaceStrategyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [events, setEvents] = useState<any[]>(fallbackEvents)
  const [loading, setLoading] = useState(true)

  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || new Date().getFullYear().toString())
  const [selectedEvent, setSelectedEvent] = useState(searchParams.get("event") || "")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2017 }, (_, i) => (2018 + i).toString())

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        try {
          const eventsData = await getEvents(Number.parseInt(selectedYear))
          if (eventsData.length > 0) setEvents(eventsData)
        } catch (error) {
          console.error("Error fetching data, using fallback data:", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedYear])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    params.set("year", selectedYear)
    params.set("event", selectedEvent)
    router.push(`/race-strategy?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Race Strategy Analysis</CardTitle>
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

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              Select a race to view detailed strategy information including pit stops, tire compounds, and race position
              changes.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full" disabled={loading || !selectedYear || !selectedEvent}>
          Analyze Race Strategy
        </Button>
      </CardFooter>
    </Card>
  )
}
