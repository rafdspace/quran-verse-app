import type { Translation } from "../types/translation";

interface Props {
  language?: string;
}

export async function fetchTranslations({
  language = "en",
}: Props = {}): Promise<Translation[]> {
  const query = new URLSearchParams({
    language,
  }).toString();

  const res = await fetch(`${BACKEND_HOST}/translations?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chapters");
  }

  return (await res.json()) as Translation[];
}
