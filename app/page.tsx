import Link from "next/link"
import { RaceCard } from "@/components/race-card"
import { DriverCard } from "@/components/driver-card"
import { HeroSection } from "@/components/hero-section"
import { getEvents, getDrivers } from "@/lib/api"
import { fallbackEvents, fallbackDrivers } from "@/lib/fallback-data"

export default async function Home() {
  let events = []
  let drivers = []

  try {
    const fetchedEvents = await getEvents()
    if (fetchedEvents && fetchedEvents.length > 0) {
      events = fetchedEvents
    } else {
      events = fallbackEvents
    }
  } catch (error) {
    console.error("Error fetching events, using fallback data:", error)
    events = fallbackEvents
  }

  try {
    const fetchedDrivers = await getDrivers()
    if (fetchedDrivers && fetchedDrivers.length > 0) {
      drivers = fetchedDrivers
    } else {
      drivers = fallbackDrivers
    }
  } catch (error) {
    console.error("Error fetching drivers, using fallback data:", error)
    drivers = fallbackDrivers
  }

  const currentDate = new Date()
  const upcomingEvents = events.filter((event) => new Date(event.date) > currentDate).slice(0, 3)

  const recentEvents = events
    .filter((event) => new Date(event.date) <= currentDate)
    .slice(-3)
    .reverse()

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="container py-12 space-y-6">
        <div className="flex flex-col gap-2 opacity-0 translate-y-5 animate-[fadeIn_0.5s_forwards]">
          <h2 className="text-3xl font-bold tracking-tight">Upcoming Races</h2>
          <p className="text-muted-foreground">Stay up to date with the next Formula 1 races</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => <RaceCard key={event.round} event={event} index={index} />)
          ) : (
            <div className="col-span-3 text-center py-10 text-muted-foreground">
              No upcoming races found. Check back later.
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Link href="/calendar" className="text-primary hover:underline flex items-center gap-1">
            View full calendar
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container space-y-6">
          <div className="flex flex-col gap-2 opacity-0 translate-y-5 animate-[fadeIn_0.5s_forwards] [animation-delay:0.1s]">
            <h2 className="text-3xl font-bold tracking-tight">Recent Races</h2>
            <p className="text-muted-foreground">Check out the latest Formula 1 race results and analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentEvents.length > 0 ? (
              recentEvents.map((event, index) => <RaceCard key={event.round} event={event} isRecent index={index} />)
            ) : (
              <div className="col-span-3 text-center py-10 text-muted-foreground">
                No recent races found. Check back after the season starts.
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Link href="/results" className="text-primary hover:underline flex items-center gap-1">
              View all results
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-12 space-y-6">
        <div className="flex flex-col gap-2 opacity-0 translate-y-5 animate-[fadeIn_0.5s_forwards] [animation-delay:0.2s]">
          <h2 className="text-3xl font-bold tracking-tight">Drivers</h2>
          <p className="text-muted-foreground">Explore the current Formula 1 drivers and their statistics</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {drivers.slice(0, 10).map((driver, index) => (
            <DriverCard key={driver.driver_number} driver={driver} index={index} />
          ))}
        </div>

        <div className="flex justify-end">
          <Link href="/drivers" className="text-primary hover:underline flex items-center gap-1">
            View all drivers
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-r from-f1-red to-red-800 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center opacity-0 animate-[fadeIn_0.6s_forwards] [animation-delay:0.3s]">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Explore F1 Data</h2>
              <p className="text-white/90">
                Experience Formula 1 like never before with our advanced data-driven platform designed for 
                fans, analysts, and professionals alike to gain unparalleled insights and features to 
                compare drivers, analyze telemetry, and explore race strategies and Unlock the full 
                story behind every lap, overtake, and pit stop.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/telemetry"
                  className="bg-white text-red-600 hover:bg-white/90 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Telemetry
                </Link>
                <Link
                  href="/lap-comparison"
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Lap Comparison
                </Link>
                <Link
                  href="/race-strategy"
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Race Strategy
                </Link>
                <Link
                  href="/track-position"
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Track Position
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
              <img
                src="/foot1.jpg"
                alt="F1 Data Analysis"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
