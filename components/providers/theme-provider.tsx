"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "atlas-pokedex:theme-mode";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const nextMode = storedMode === "light" || storedMode === "dark" || storedMode === "system" ? storedMode : "system";
    setModeState(nextMode);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function syncTheme() {
      const nextResolvedTheme = mode === "system" ? getSystemTheme() : mode;
      setResolvedTheme(nextResolvedTheme);
      document.documentElement.dataset.theme = nextResolvedTheme;
      document.documentElement.dataset.themeMode = mode;
    }

    syncTheme();
    mediaQuery.addEventListener("change", syncTheme);

    return () => {
      mediaQuery.removeEventListener("change", syncTheme);
    };
  }, [mode]);

  function setMode(nextMode: ThemeMode) {
    setModeState(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
  }

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode
    }),
    [mode, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeProvider");
  }

  return context;
}
