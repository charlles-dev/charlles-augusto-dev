import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      if (typeof window === "undefined") return defaultTheme
      const stored = window.localStorage?.getItem(storageKey) as Theme | null
      return stored || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  useEffect(() => {
    if (typeof document === "undefined") return
    const root = document.documentElement as HTMLElement | null
    if (!root || !("classList" in root)) return

    root.classList.remove("light", "dark")

    let appliedTheme: Theme = theme
    if (theme === "system") {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")
        .matches
      appliedTheme = prefersDark ? "dark" : "light"
    }

    root.classList.add(appliedTheme)
  }, [theme])

  const value = {
    theme,
    setTheme: (t: Theme) => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage?.setItem(storageKey, t)
        }
      } catch {}
      setTheme(t)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}