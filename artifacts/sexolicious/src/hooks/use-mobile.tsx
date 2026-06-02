import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useMinWidth(minWidth: number) {
  // Initialise synchronously from matchMedia so the first paint is already
  // correct — avoids a flicker (desktop briefly marqueeing / collage popping in).
  const [matches, setMatches] = React.useState(() =>
    typeof window !== "undefined" && window.matchMedia(`(min-width: ${minWidth}px)`).matches
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener("change", onChange)
    setMatches(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [minWidth])

  return matches
}
