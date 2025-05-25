import type React from "react"
import { cn } from "@/lib/utils"

interface DataCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  className?: string
  index?: number
}

export function DataCard({ title, value, icon, description, className, index = 0 }: DataCardProps) {
  return (
    <div 
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm",
        "opacity-0 translate-y-4",
        "animate-[fadeIn_0.5s_forwards]",
        className,
      )}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex items-center gap-2">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
