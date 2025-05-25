import Link from "next/link"
import { CalendarIcon, MapPinIcon, TrophyIcon } from "lucide-react"

interface RaceCardProps {
  event: any
  isRecent?: boolean
  index?: number
}

export function RaceCard({ event, isRecent = false, index = 0 }: RaceCardProps) {
  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()

  return (
    <Link
      href={
        isPast
          ? `/race-results/${new Date(event.date).getFullYear()}/${event.name}`
          : `/circuits/${new Date(event.date).getFullYear()}/${event.round}`
      }
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <img
          src={event.image_url || `/placeholder.svg?height=300&width=500&text=${event.event_name}`}
          alt={`${event.event_name} circuit`}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 z-20 p-4 text-white">
          <p className="text-xl font-bold leading-tight">{event.event_name}</p>
          <p className="text-sm text-white/90">{event.location}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <span>
            {eventDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPinIcon className="h-4 w-4 text-primary" />
          <span>{event.country}</span>
        </div>
        {isRecent && event.winner && (
          <div className="flex items-center gap-2 text-sm mt-1">
            <TrophyIcon className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{event.winner}</span>
          </div>
        )}
        {isPast && !isRecent && (
          <div className="mt-2">
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {isRecent ? "Recent Race" : "View Results"}
            </span>
          </div>
        )}
        {!isPast && (
          <div className="mt-2">
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Upcoming Race</span>
          </div>
        )}
      </div>
    </Link>
  )
}
