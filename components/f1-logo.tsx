interface F1LogoProps {
  animate?: boolean
}

export function F1Logo({ animate = true }: F1LogoProps) {
  return animate ? (
    <div className="bg-f1-red text-white font-bold text-xl px-2 py-1 rounded flex items-center -translate-x-5 opacity-0 animate-[slideInRight_0.5s_forwards]">
      <span className="opacity-0 animate-[fadeIn_0.3s_0.2s_forwards]">F1</span>
      <span className="ml-2 hidden sm:inline-block opacity-0 animate-[fadeIn_0.3s_0.4s_forwards]">Insights</span>
    </div>
  ) : (
    <div className="bg-f1-red text-white font-bold text-xl px-2 py-1 rounded flex items-center">
      <span>F1</span>
      <span className="ml-2 hidden sm:inline-block">Insights</span>
    </div>
  )
}
