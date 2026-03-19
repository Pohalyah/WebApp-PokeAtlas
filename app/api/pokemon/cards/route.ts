import { NextResponse } from "next/server";

import { getPokemonCardsByIds } from "@/lib/pokemon-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .slice(0, 30);

  const cards = await getPokemonCardsByIds(ids);

  return NextResponse.json({ cards });
}
