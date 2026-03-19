import type { PokemonTypeName } from "@/lib/types";

export const TYPE_LABELS: Record<PokemonTypeName, string> = {
  normal: "Normal",
  fire: "Feu",
  water: "Eau",
  electric: "Électrik",
  grass: "Plante",
  ice: "Glace",
  fighting: "Combat",
  poison: "Poison",
  ground: "Sol",
  flying: "Vol",
  psychic: "Psy",
  bug: "Insecte",
  rock: "Roche",
  ghost: "Spectre",
  dragon: "Dragon",
  dark: "Ténèbres",
  steel: "Acier",
  fairy: "Fée"
};

export const TYPE_THEME: Record<
  PokemonTypeName,
  {
    bg: string;
    bgSoft: string;
    text: string;
    accent: string;
    ring: string;
    gradient: string;
  }
> = {
  normal: {
    bg: "#F1E8D4",
    bgSoft: "#FBF7ED",
    text: "#7A6B46",
    accent: "#B8A985",
    ring: "rgba(184, 169, 133, 0.34)",
    gradient: "from-[#F7EFE0] via-[#FFF8EE] to-[#F2F4FB]"
  },
  fire: {
    bg: "#FFE4D5",
    bgSoft: "#FFF5EF",
    text: "#B44C1D",
    accent: "#FF8D4B",
    ring: "rgba(255, 141, 75, 0.34)",
    gradient: "from-[#FFE0CF] via-[#FFF4EC] to-[#FFF8F2]"
  },
  water: {
    bg: "#DDEEFF",
    bgSoft: "#F3F8FF",
    text: "#2963B1",
    accent: "#63A7FF",
    ring: "rgba(99, 167, 255, 0.34)",
    gradient: "from-[#DDEBFF] via-[#F4F8FF] to-[#F6FBFF]"
  },
  electric: {
    bg: "#FFF0AE",
    bgSoft: "#FFFBE6",
    text: "#A77B08",
    accent: "#F6C945",
    ring: "rgba(246, 201, 69, 0.34)",
    gradient: "from-[#FFF2AA] via-[#FFFBE7] to-[#FFFDF3]"
  },
  grass: {
    bg: "#DDF4DE",
    bgSoft: "#F4FCF3",
    text: "#2E7D3F",
    accent: "#6BC17D",
    ring: "rgba(107, 193, 125, 0.34)",
    gradient: "from-[#DAF1DB] via-[#F3FCF3] to-[#F8FFF7]"
  },
  ice: {
    bg: "#DDF8F6",
    bgSoft: "#F1FEFD",
    text: "#2B8B8B",
    accent: "#71D5D2",
    ring: "rgba(113, 213, 210, 0.34)",
    gradient: "from-[#D8F5F4] via-[#F1FEFD] to-[#F7FFFF]"
  },
  fighting: {
    bg: "#F8D9D5",
    bgSoft: "#FFF3F2",
    text: "#9E4031",
    accent: "#D6715E",
    ring: "rgba(214, 113, 94, 0.34)",
    gradient: "from-[#F8D7D3] via-[#FFF3F2] to-[#FFF8F7]"
  },
  poison: {
    bg: "#F0E1FA",
    bgSoft: "#FBF6FF",
    text: "#834DAD",
    accent: "#BA82DF",
    ring: "rgba(186, 130, 223, 0.34)",
    gradient: "from-[#F0DFFC] via-[#FBF6FF] to-[#FFF9FF]"
  },
  ground: {
    bg: "#F5E4C8",
    bgSoft: "#FEF8EC",
    text: "#94692C",
    accent: "#D6A96C",
    ring: "rgba(214, 169, 108, 0.34)",
    gradient: "from-[#F4E0BE] via-[#FEF8EC] to-[#FFFDF7]"
  },
  flying: {
    bg: "#E6EAFF",
    bgSoft: "#F7F8FF",
    text: "#5467BA",
    accent: "#8FA5FF",
    ring: "rgba(143, 165, 255, 0.34)",
    gradient: "from-[#E6EAFF] via-[#F7F8FF] to-[#FCFCFF]"
  },
  psychic: {
    bg: "#FFDCE7",
    bgSoft: "#FFF4F7",
    text: "#B73A68",
    accent: "#FF7BA6",
    ring: "rgba(255, 123, 166, 0.34)",
    gradient: "from-[#FFD9E4] via-[#FFF4F7] to-[#FFF9FB]"
  },
  bug: {
    bg: "#E8F2D3",
    bgSoft: "#F8FDEB",
    text: "#718C23",
    accent: "#A9C85A",
    ring: "rgba(169, 200, 90, 0.34)",
    gradient: "from-[#E7F0D0] via-[#F8FDEB] to-[#FCFFF4]"
  },
  rock: {
    bg: "#EEE5D1",
    bgSoft: "#FBF8EF",
    text: "#8A6B2D",
    accent: "#C7A86A",
    ring: "rgba(199, 168, 106, 0.34)",
    gradient: "from-[#EEE3CB] via-[#FBF8EF] to-[#FFFDF8]"
  },
  ghost: {
    bg: "#E8E3FA",
    bgSoft: "#F8F5FF",
    text: "#6851B0",
    accent: "#9A89E0",
    ring: "rgba(154, 137, 224, 0.34)",
    gradient: "from-[#E5E0FA] via-[#F8F5FF] to-[#FCFBFF]"
  },
  dragon: {
    bg: "#E1E7FF",
    bgSoft: "#F5F7FF",
    text: "#425FB8",
    accent: "#7D94FF",
    ring: "rgba(125, 148, 255, 0.34)",
    gradient: "from-[#DFE6FF] via-[#F5F7FF] to-[#FBFCFF]"
  },
  dark: {
    bg: "#E8E0E6",
    bgSoft: "#F8F5F7",
    text: "#5B4957",
    accent: "#8A7483",
    ring: "rgba(138, 116, 131, 0.34)",
    gradient: "from-[#E8DEE3] via-[#F8F5F7] to-[#FCFAFB]"
  },
  steel: {
    bg: "#E2ECF3",
    bgSoft: "#F4F8FB",
    text: "#557585",
    accent: "#8AA7B6",
    ring: "rgba(138, 167, 182, 0.34)",
    gradient: "from-[#DFE9F0] via-[#F4F8FB] to-[#FAFDFF]"
  },
  fairy: {
    bg: "#FFE1F2",
    bgSoft: "#FFF4FA",
    text: "#BC5B85",
    accent: "#FF9EC6",
    ring: "rgba(255, 158, 198, 0.34)",
    gradient: "from-[#FFE0F0] via-[#FFF4FA] to-[#FFF9FC]"
  }
};

export function getTypeLabel(type: PokemonTypeName) {
  return TYPE_LABELS[type];
}

export function getTypeTheme(type: PokemonTypeName) {
  return TYPE_THEME[type];
}
