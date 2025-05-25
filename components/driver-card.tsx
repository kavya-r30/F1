import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface DriverCardProps {
  driver: any
  index?: number
}

export function DriverCard({ driver, index = 0 }: DriverCardProps) {
  return (
    <Link
      href={`/drivers/${driver.name}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md",
        "opacity-0 translate-y-4",
        "animate-[fadeIn_0.5s_forwards]",
      )}
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="relative aspect-[6/5] w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <Image
          src={`/drivers/crop/${driver.name}.png`}
          alt={`${driver.name}`}
          fill
          className="object-cover transition-transform group-hover:scale-105 bg-white dark:bg-sky-950"
        />
        <div className="absolute bottom-0 left-0 z-20 p-3 text-white">
          <p className="text-lg font-bold leading-tight">{driver.name}</p>
          <p className="text-sm text-white/80">{driver.team}</p>
        </div>
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {driver.driver_number}
          </span>
          <span className="text-smrCart-medium">{driver.nationality}</span>
        </div>
        <div className="text-sm font-medium">{driver.points || 0} pts</div>
      </div>
    </Link>
  )
}
