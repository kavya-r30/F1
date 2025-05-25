import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { TeamsPageContent } from "@/components/teams-page-content"

export const metadata = {
  title: "Teams | F1 Data Visualization",
  description: "Explore Formula 1 teams and their performance statistics",
}

export default function TeamsPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Formula 1 Teams</h1>
        <p className="text-muted-foreground">
          Explore information about Formula 1 teams and their performance statistics
        </p>
      </div>

      <Suspense fallback={<TeamsPageSkeleton />}>
        <TeamsPageContent />
      </Suspense>
    </main>
  )
}

function TeamsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
      ))}
    </div>
  )
}
