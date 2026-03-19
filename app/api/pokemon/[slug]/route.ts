import { NextResponse } from "next/server";

import { getPokemonDetail } from "@/lib/pokemon-api";

interface RouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;

  try {
    const pokemon = await getPokemonDetail(slug);
    return NextResponse.json({ pokemon });
  } catch {
    return NextResponse.json({ message: "Pokemon introuvable" }, { status: 404 });
  }
}
