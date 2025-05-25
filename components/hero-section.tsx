import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing/land3.jpeg"
          alt="Formula 1 race"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-[1]"></div>
      <div className="container relative z-10 flex flex-col items-center text-center space-y-8 px-4">
        <div className="space-y-4 opacity-1 translate-y-6 animate-[fadeIn_0.7s_0.2s_forwards]">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/90 text-sm font-medium opacity-1 scale-90 animate-[scaleIn_0.5s_0.5s_forwards]">
            <span className="bg-f1-red text-white px-2 py-0.5 rounded mr-2">NEW</span>
            Explore the latest F1 data and insights
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight opacity-1 translate-y-4 animate-[fadeUp_0.7s_0.3s_forwards]">
            Formula 1 <span className="text-f1-red">Data</span> Visualization
          </h1>

          <p className="text-xl text-white/90 max-w-3xl mx-auto opacity-1 translate-y-4 animate-[fadeUp_0.7s_0.4s_forwards]">
            Explore detailed telemetry, lap data, race strategies, and circuit information from Formula 1 races
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 opacity-1 translate-y-4 animate-[fadeUp_0.7s_0.6s_forwards]">
          <Link
            href="/race-strategy"
            className="bg-f1-red hover:bg-red-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            Explore Strategy
          </Link>
          <Link
            href="/lap-comparison"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-md font-medium transition-colors backdrop-blur-sm"
          >
            Compare Laps
          </Link>
          <Link
            href="/circuits"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-md font-medium transition-colors backdrop-blur-sm"
          >
            View Circuits
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[2]"></div>
    </section>
  )
}
