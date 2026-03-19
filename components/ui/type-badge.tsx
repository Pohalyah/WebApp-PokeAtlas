import type { PokemonTypeName } from "@/lib/types";
import { getTypeLabel, getTypeTheme } from "@/lib/pokemon-theme";
import { cn } from "@/lib/utils";

interface TypeBadgeProps {
  type: PokemonTypeName;
  className?: string;
  muted?: boolean;
  inverted?: boolean;
}

export function TypeBadge({ type, className, muted = false, inverted = false }: TypeBadgeProps) {
  const theme = getTypeTheme(type);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide",
        className
      )}
      style={{
        backgroundColor: inverted ? "rgba(255,255,255,0.12)" : muted ? theme.bgSoft : theme.bg,
        borderColor: inverted ? "rgba(255,255,255,0.16)" : theme.ring,
        color: inverted ? "#ffffff" : theme.text
      }}
    >
      {getTypeLabel(type)}
    </span>
  );
}
