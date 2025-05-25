import Link from "next/link"

interface TeamCardProps {
  team: any
  index?: number
}

export function TeamCard({ team, index = 0 }: TeamCardProps) {
  const teamNameForUrl = encodeURIComponent(team.name)

  return (
    <Link
      href={`/teams/${teamNameForUrl}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <img
          src={`/teams/${team.name}.jpg` || '/placeholder.svg'}
          alt={`${team.name}`}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 z-20 p-3 text-white">
          <p className="text-lg font-bold leading-tight">{team.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="text-sm font-medium">{team.full_name || team.name}</div>
        <div className="text-sm font-medium">{team.points || 0} pts</div>
      </div>
    </Link>
  )
}
