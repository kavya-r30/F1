"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { F1Logo } from "@/components/f1-logo"

type ListItemProps = {
  href: string
  title: string
  children?: React.ReactNode
}

function ListItem({ href, title, children }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1.5 p-3 leading-none rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[active]:bg-accent data-[active]:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-tight text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-[3.75rem] items-center">
        <div className="hidden md:flex items-center justify-center w-full">
          <Link href="/" className="flex items-center space-x-2 left-4 absolute">
            <F1Logo />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/calendar" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Calendar</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/standings" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Standings</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Races & Circuits</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-5 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-between rounded-md bg-cover bg-center p-5 no-underline outline-none focus:shadow-md"
                          style={{ backgroundImage: "url('/nav.jpeg')" }}
                          href="/circuits"
                        >
                          <div className="text-lg font-medium text-white" style={{fontFamily: 'F1Font'}}>F1 Circuits</div>
                          <p className="text-sm leading-tight text-white/90">
                            Explore Formula 1 circuits around the world.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/circuits" title="Circuits">
                      Explore F1 circuits and track layouts.
                    </ListItem>
                    <ListItem href="/results" title="Race Results">
                      View detailed race results and analysis.
                    </ListItem>
                    <ListItem href="/sessions" title="Session Results">
                      Explore practice, qualifying, and sprint results.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Teams & Drivers</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 md:grid-rows-2 lg:w-[600px]">
                    <li className="col-start-1 row-start-1">
                      <ListItem href="/drivers" title="Drivers">
                        Driver profiles and statistics.
                      </ListItem>
                    </li>
                    <li className="col-start-2 row-start-1">
                      <ListItem href="/teams" title="Teams">
                        Team profiles and performance data.
                      </ListItem>
                    </li>
                    <li className="col-start-3 row-start-1 row-span-2">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-cover bg-center p-5 no-underline outline-none focus:shadow-md"
                          style={{ backgroundImage: "radial-gradient(circle at center, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.2) 100%), url('/nav2.jpeg')" }}
                          href="/championship"
                        >
                          <div className="text-lg font-semibold text-f1-red" style={{ fontFamily: 'F1Font' }}>
                            Championship
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li className="col-start-1 row-start-2">
                      <ListItem href="/driver-comparison" title="Driver Comparison">
                        Compare performance between drivers.
                      </ListItem>
                    </li>
                    <li className="col-start-2 row-start-2">
                      <ListItem href="/championship" title="Championship History">
                        Explore past championship results.
                      </ListItem>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Data Analysis</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 md:grid-rows-2 lg:w-[600px]">
                    <li className="col-start-1 row-start-1">
                      <ListItem href="/telemetry" title="Telemetry">
                        Analyze detailed car performance data.
                      </ListItem>
                    </li>
                    <li className="col-start-2 row-start-1">
                      <ListItem href="/lap-comparison" title="Lap Comparison">
                        Compare lap times between drivers.
                      </ListItem>
                    </li>
                    <li className="col-start-3 row-start-1 row-span-2">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-cover bg-center p-5 no-underline outline-none focus:shadow-md"
                          style={{ backgroundImage: "url('/nav3.jpg')" }}
                          href="/positions"
                        >
                          <div className="text-lg font-medium text-white" style={{ fontFamily: 'F1Font' }}>
                            Track Positions
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li className="col-start-1 row-start-2">
                      <ListItem href="/race-strategy" title="Race Strategy">
                        Explore pit stop strategies and tire usage.
                      </ListItem>
                    </li>
                    <li className="col-start-2 row-start-2">
                      <ListItem href="/positions" title="Track Position">
                        Visualize car positions throughout races.
                      </ListItem>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center right-4 absolute">
            <ThemeToggle />
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between w-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2 mx-auto">
            <F1Logo />
          </Link>

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  return (
    <div className="flex flex-col h-full divide-y">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <F1Logo />
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="flex flex-col space-y-2 px-4">
          <li>
            <Link href="/" className="flex items-center py-2 text-lg font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link href="/calendar" className="flex items-center py-2 text-lg font-medium">
              Calendar
            </Link>
          </li>
          <li>
            <Link href="/standings" className="flex items-center py-2 text-lg font-medium">
              Standings
            </Link>
          </li>
          <li>
            <p className="py-2 text-lg font-medium">Races & Circuits</p>
            <ul className="pl-4 space-y-2">
              <li>
                <Link href="/circuits" className="flex items-center py-1 text-base">
                  Circuits
                </Link>
              </li>
              <li>
                <Link href="/results" className="flex items-center py-1 text-base">
                  Race Results
                </Link>
              </li>
              <li>
                <Link href="/sessions" className="flex items-center py-1 text-base">
                  Session Results
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <p className="py-2 text-lg font-medium">Teams & Drivers</p>
            <ul className="pl-4 space-y-2">
              <li>
                <Link href="/drivers" className="flex items-center py-1 text-base">
                  Drivers
                </Link>
              </li>
              <li>
                <Link href="/teams" className="flex items-center py-1 text-base">
                  Teams
                </Link>
              </li>
              <li>
                <Link href="/driver-comparison" className="flex items-center py-1 text-base">
                  Driver Comparison
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
