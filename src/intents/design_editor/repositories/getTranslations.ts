import type { Translation } from "../types/translation";

export async function fetchTranslations(): Promise<Translation[]> {
  const res = await fetch(`${BACKEND_HOST}/translations`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chapters");
  }

  return (await res.json()) as Translation[];
}
