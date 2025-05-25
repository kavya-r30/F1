import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} F1 Insights. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">Formula 1 data visualization for enthusiasts</p>
        </div>

        <div className="flex gap-6">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
