"use client"

import { useState } from "react"
import Image from "next/image"
import type { CircuitInfo } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trophy, Calendar, Ruler, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CircuitDetailsProps {
  circuitInfo: {
    year: number
    event: string
    circuit_info: CircuitInfo
  }
}

export function CircuitDetails({ circuitInfo }: CircuitDetailsProps) {
  const { circuit_info } = circuitInfo
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{circuit_info.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">
            {circuit_info.location}, {circuit_info.country}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative rounded-lg overflow-hidden bg-white aspect-video opacity-0 animate-fade-in translate-y-5 animate-slide-in-up">
          {circuit_info.track_layout ? (
            <div className="relative w-full h-full">
              <Image
                src={`data:image/png;base64,${circuit_info.track_layout}`}
                alt={`${circuit_info.name} track layout`}
                fill
                className={`object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"} p-8 pt-10`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Track layout not available</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="opacity-0 animate-[fadeIn_0.5s_0.1s_forwards]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Circuit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">First Grand Prix</div>
                  <div className="font-medium">{circuit_info.first_grand_prix || "Not available"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Number of Laps</div>
                  <div className="font-medium">{circuit_info.number_of_laps || "Not available"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Circuit Length</div>
                  <div className="font-medium">
                    {circuit_info.circuit_length ? `${circuit_info.circuit_length} km` : "Not available"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Race Distance</div>
                  <div className="font-medium">
                    {circuit_info.race_distance ? `${circuit_info.race_distance} km` : "Not available"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-0 animate-[fadeIn_0.5s_0.2s_forwards]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Lap Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              {circuit_info.lap_record_time ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{circuit_info.lap_record_time}</div>
                  <div className="text-muted-foreground">
                    Set by <span className="font-medium">{circuit_info.lap_record_driver}</span> in{" "}
                    <span className="font-medium">{circuit_info.lap_record_year}</span>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">Lap record information not available</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-0 animate-[fadeIn_0.5s_0.4s_forwards]">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Circuit Length</p>
                <p className="text-2xl font-bold">
                  {circuit_info.circuit_length ? `${circuit_info.circuit_length} km` : "N/A"}
                </p>
              </div>
              <Ruler className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Laps</p>
                <p className="text-2xl font-bold">{circuit_info.number_of_laps || "N/A"}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Race Distance</p>
                <p className="text-2xl font-bold">
                  {circuit_info.race_distance ? `${circuit_info.race_distance} km` : "N/A"}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
