import { API_BASE_URL } from "../constants";
import type { Translation } from "../types/translation";

export async function fetchTranslations(): Promise<Translation[]> {
  const res = await fetch(`${API_BASE_URL}/translations`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chapters");
  }

  return (await res.json()) as Translation[];
}
