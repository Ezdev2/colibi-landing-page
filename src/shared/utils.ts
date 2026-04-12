import type { Market, SearchMode, SearchFormState } from "./types";
import { markets, quickFilters } from "./data";

export function getMarket(id: string | null): Market {
  return markets.find((market) => market.id === id) ?? markets[0];
}

export function getMode(value: string | null): SearchMode {
  if (value === "ai" || value === "offmarket") {
    return value;
  }
  return "classic";
}

export function buildPath(
  path: string,
  params: Record<string, string | undefined | null>
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export function createFormState(
  market: Market,
  params?: URLSearchParams
): SearchFormState {
  return {
    propertyType: params?.get("type") ?? market.defaultType,
    location: params?.get("location") ?? market.defaultLocation,
    budget: params?.get("budget") ?? "3 M€ – 8 M€",
    surface: params?.get("surface") ?? "250 m² +",
    availability: params?.get("availability") ?? "Immédiate",
    aiPrompt:
      params?.get("prompt") ??
      `Je cherche une ${market.defaultType.toLowerCase()} lumineuse à ${market.city}, avec lignes architecturales fortes, matériaux nobles, piscine et grande réception.`,
    offmarketType: params?.get("offType") ?? market.defaultType,
    offmarketArea: params?.get("offArea") ?? market.defaultLocation,
    offmarketBudget: params?.get("offBudget") ?? "Confidentiel",
    offmarketTiming: params?.get("offTiming") ?? "Sous 6 mois",
  };
}

export function getFilterLabel(key: string | null): string | undefined {
  return quickFilters.find((filter) => filter.key === key)?.label;
}

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
