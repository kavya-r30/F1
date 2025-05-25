"use client"

import { useState } from "react"
import { TelemetryForm } from "@/components/telemetry-form"
import { TelemetryVisualization } from "@/components/telemetry-visualization"

export default function TelemetryPage() {
  const [formData, setFormData] = useState<{
    year: number
    event: string
    driver: string
    lap?: number
    metrics: string[]
  } | null>(null)

  const handleFormSubmit = (data: {
    year: number
    event: string
    driver: string
    lap?: number
    metrics: string[]
  }) => {
    setFormData(data)
  }

  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Telemetry</h1>
        <p className="text-muted-foreground">
          Analyze detailed telemetry data from Formula 1 races, including speed, throttle, brake, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TelemetryForm onSubmit={handleFormSubmit} />
        </div>
        <div className="md:col-span-2">
          {formData && <TelemetryVisualization initialData={formData} />}
        </div>
      </div>
    </main>
  )
}
