import { NextResponse } from "next/server";

import { getPokemonIdsByType } from "@/lib/pokemon-api";
import { POKEMON_TYPES } from "@/lib/constants";
import type { PokemonTypeName } from "@/lib/types";

interface RouteProps {
  params: Promise<{
    type: string;
  }>;
}

export async function GET(_: Request, { params }: RouteProps) {
  const { type } = await params;

  if (!POKEMON_TYPES.includes(type as PokemonTypeName)) {
    return NextResponse.json({ ids: [] }, { status: 404 });
  }

  const ids = await getPokemonIdsByType(type as PokemonTypeName);
  return NextResponse.json({ ids });
}
