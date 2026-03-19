import { POKEMON_TYPES } from "@/lib/constants";
import { getTypeLabel, getTypeTheme } from "@/lib/pokemon-theme";
import type { PokemonResistanceItem, PokemonTypeName } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WeaknessChartProps {
  weaknesses: PokemonResistanceItem[];
  resistances: PokemonResistanceItem[];
  immunities: PokemonTypeName[];
}

function buildMultiplierMap(
  weaknesses: PokemonResistanceItem[],
  resistances: PokemonResistanceItem[],
  immunities: PokemonTypeName[]
) {
  const multiplierMap = new Map<PokemonTypeName, number>();

  POKEMON_TYPES.forEach((type) => multiplierMap.set(type, 1));
  resistances.forEach((item) => multiplierMap.set(item.type, item.multiplier));
  weaknesses.forEach((item) => multiplierMap.set(item.type, item.multiplier));
  immunities.forEach((type) => multiplierMap.set(type, 0));

  return multiplierMap;
}

function getMultiplierTone(multiplier: number) {
  if (multiplier === 0) {
    return "bg-slate-200 text-slate-700";
  }

  if (multiplier === 0.25) {
    return "bg-emerald-200 text-emerald-900";
  }

  if (multiplier === 0.5) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (multiplier === 2) {
    return "bg-rose-100 text-rose-700";
  }

  if (multiplier >= 4) {
    return "bg-red-200 text-red-800";
  }

  return "bg-amber-100 text-amber-800";
}

function formatMultiplier(multiplier: number) {
  if (multiplier === 0) {
    return "0";
  }

  if (multiplier === 0.25) {
    return "1/4";
  }

  if (multiplier === 0.5) {
    return "1/2";
  }

  return `${multiplier}`.replace(".", ",");
}

const legend = [
  { label: "Immunite", value: "0", tone: "bg-slate-200 text-slate-700" },
  { label: "Double resistance", value: "1/4", tone: "bg-emerald-200 text-emerald-900" },
  { label: "Resistance", value: "1/2", tone: "bg-emerald-100 text-emerald-700" },
  { label: "Neutre", value: "1", tone: "bg-amber-100 text-amber-800" },
  { label: "Faiblesse", value: "2", tone: "bg-rose-100 text-rose-700" },
  { label: "Double faiblesse", value: "4", tone: "bg-red-200 text-red-800" }
];

export function WeaknessChart({ weaknesses, resistances, immunities }: WeaknessChartProps) {
  const multiplierMap = buildMultiplierMap(weaknesses, resistances, immunities);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1 md:[grid-template-columns:repeat(18,minmax(0,1fr))]">
        {POKEMON_TYPES.map((type) => {
          const theme = getTypeTheme(type);
          const multiplier = multiplierMap.get(type) ?? 1;

          return (
            <div
              key={type}
              className="overflow-hidden rounded-[10px] border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)]"
            >
              <div
                className="flex min-h-[18px] items-center justify-center px-1 py-0.5 text-center text-[7px] font-semibold uppercase tracking-[0.08em]"
                style={{
                  backgroundColor: theme.bg,
                  color: theme.text
                }}
              >
                {getTypeLabel(type)}
              </div>
              <div className="px-1 py-1">
                <div className={cn("rounded-full px-1 py-0.5 text-center text-[9px] font-semibold", getMultiplierTone(multiplier))}>
                  x {formatMultiplier(multiplier)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 xl:grid-cols-6">
        {legend.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] px-2 py-1 text-[10px] theme-text-secondary"
          >
            <span className={cn("rounded-full px-1.5 py-0.5 font-semibold", item.tone)}>{item.value}</span>
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
