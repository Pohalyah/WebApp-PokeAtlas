import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { EvolutionNode } from "@/lib/types";
import { formatPokemonId } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface EvolutionChainProps {
  paths: EvolutionNode[][];
  selectedId: number;
}

export function EvolutionChain({ paths, selectedId }: EvolutionChainProps) {
  return (
    <div className="space-y-4">
      {paths.map((path, pathIndex) => (
        <div key={`${pathIndex}-${path.map((node) => node.id).join("-")}`} className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-center gap-3">
            {path.map((node, index) => (
              <div key={node.id} className="flex items-center gap-3">
                <Link
                  href={`/pokemon/${node.slug}`}
                  className={cn(
                    "group flex min-w-[180px] items-center gap-4 rounded-[24px] border p-4 transition-all duration-200",
                    node.id === selectedId
                      ? "border-slate-950 bg-slate-950 text-white shadow-card"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-2xl",
                      node.id === selectedId ? "bg-white/[0.12]" : "bg-slate-50"
                    )}
                  >
                    <Image src={node.image} alt={node.displayName} width={72} height={72} className="h-14 w-14 object-contain" />
                  </div>
                  <div>
                    <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", node.id === selectedId ? "text-white/[0.65]" : "text-slate-400")}>
                      {formatPokemonId(node.id)}
                    </p>
                    <p className="font-display text-base font-semibold tracking-tight">{node.displayName}</p>
                  </div>
                </Link>

                {index < path.length - 1 ? (
                  <div className="flex flex-col items-center gap-2 px-1">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      {path[index + 1]?.trigger ?? "Évolution"}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
