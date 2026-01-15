import type { Verse } from "../types/verse";

interface FetchVerseProps {
  verseKey: string;
  translationId?: string;
  language?: string;
}

export async function fetchVerseByKey({
  verseKey,
  translationId,
  language,
}: FetchVerseProps): Promise<Verse> {
  const params = new URLSearchParams();

  if (translationId) {
    params.set("translationId", translationId);
  }

  if (language) {
    params.set("language", language);
  }

  const query = params.toString();
  const url = query
    ? `${BACKEND_HOST}/verse/${verseKey}?${query}`
    : `${BACKEND_HOST}/verse/${verseKey}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch verse");
  }

  return (await res.json()) as Verse;
}
