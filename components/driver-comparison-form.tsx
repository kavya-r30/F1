"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDrivers } from "@/lib/api"
import { fallbackDrivers } from "@/lib/fallback-data"

export function DriverComparisonForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [drivers, setDrivers] = useState<any[]>(fallbackDrivers)
  const [loading, setLoading] = useState(true)

  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || new Date().getFullYear().toString())
  const [selectedDriver1, setSelectedDriver1] = useState(searchParams.get("driver1") || "")
  const [selectedDriver2, setSelectedDriver2] = useState(searchParams.get("driver2") || "")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2017 }, (_, i) => (2018 + i).toString())

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDriver1 || !selectedDriver2) {
      return
    }

    const params = new URLSearchParams()
    params.set("year", selectedYear)
    params.set("driver1", selectedDriver1)
    params.set("driver2", selectedDriver2)

    router.push(`/driver-comparison?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Drivers</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Season</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear} disabled={loading}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year} Season
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver1">First Driver</Label>
            <Select
              value={selectedDriver1}
              onValueChange={setSelectedDriver1}
              disabled={loading || drivers.length === 0}
            >
              <SelectTrigger id="driver1">
                <SelectValue placeholder="Select Driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={`${driver.driver_number}-1`} value={driver.driver_number}>
                    {driver.name} ({driver.team_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver2">Second Driver</Label>
            <Select
              value={selectedDriver2}
              onValueChange={setSelectedDriver2}
              disabled={loading || drivers.length === 0}
            >
              <SelectTrigger id="driver2">
                <SelectValue placeholder="Select Driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={`${driver.driver_number}-2`} value={driver.driver_number}>
                    {driver.name} ({driver.team_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={loading || !selectedYear || !selectedDriver1 || !selectedDriver2}
        >
          Compare Drivers
        </Button>
      </CardFooter>
    </Card>
  )
}
