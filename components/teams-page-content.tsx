"use client"

import { useState, useEffect } from "react"
import { getTeams, getSeasons, type Team } from "@/lib/api"
import { TeamCard } from "@/components/team-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TeamsPageContent() {
  const [teams, setTeams] = useState<Team[]>([])
  const [seasons, setSeasons] = useState<number[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(new Date().getFullYear())
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
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const data = await getTeams(selectedSeason)
        setTeams(data)
      } catch (error) {
        console.error("Failed to fetch teams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [selectedSeason])

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(Number.parseInt(value))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Formula 1 Teams</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.name} team={team} />
        ))}
      </div>
    </div>
  )
}
