import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractIdFromUrl(url: string) {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

export function formatPokemonId(id: number) {
  return `#${id.toString().padStart(4, "0")}`;
}

export function titleize(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function cleanFlavorText(text: string) {
  return text.replace(/[\n\f\r]+/g, " ").replace(/\s+/g, " ").trim();
}

export function formatMetersFromDecimeters(value: number) {
  return `${(value / 10).toFixed(1)} m`;
}

export function formatKilogramsFromHectograms(value: number) {
  return `${(value / 10).toFixed(1)} kg`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function toSlug(input: string) {
  return input.toLowerCase().trim().replace(/\s+/g, "-");
}

export function getPokemonSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}
