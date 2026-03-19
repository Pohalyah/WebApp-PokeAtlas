"use client";

import { useEffect, useRef, useState } from "react";
import { Laptop, Moon, Sun } from "lucide-react";

import { useThemeMode } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Jour", icon: Sun },
  { value: "dark", label: "Nuit", icon: Moon },
  { value: "system", label: "Systeme", icon: Laptop }
] as const;

export function ThemeSwitcher() {
  const { mode, resolvedTheme, setMode } = useThemeMode();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ActiveIcon = resolvedTheme === "dark" ? Moon : Sun;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-5 left-5 z-50">
      {isOpen ? (
        <div className="mb-3 min-w-[176px] rounded-[22px] border border-[var(--panel-border)] bg-[var(--panel-bg)] p-2 shadow-card backdrop-blur-xl">
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = mode === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setMode(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-[16px] px-3 py-2.5 text-sm transition-colors duration-200",
                  isActive
                    ? "theme-button-solid"
                    : "theme-text-secondary hover:bg-[color:var(--accent-soft)]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {option.label}
                </span>
                {isActive ? <span className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">Actif</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="theme-button-soft flex h-12 w-12 items-center justify-center rounded-full border shadow-card backdrop-blur-xl transition-transform duration-200 hover:scale-105"
        aria-label="Changer le theme"
      >
        <ActiveIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
