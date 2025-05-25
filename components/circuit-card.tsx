import Link from "next/link"
import { MapPinIcon, CalendarIcon } from "lucide-react"

interface CircuitCardProps {
  circuit: any
  index?: number
}

export function CircuitCard({ circuit, index = 0 }: CircuitCardProps) {
  return (
    <Link
      href={`/circuits/${circuit.year}/${circuit.round}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <img
          src={circuit.image_url || `/placeholder.svg?height=300&width=500&text=${circuit.name}`}
          alt={`${circuit.name} circuit`}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 z-20 p-4 text-white">
          <p className="text-xl font-bold leading-tight">{circuit.name}</p>
          <p className="text-sm text-white/90">{circuit.location}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPinIcon className="h-4 w-4 text-primary" />
          <span>{circuit.country}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <span>
            {new Date(circuit.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  )
}
