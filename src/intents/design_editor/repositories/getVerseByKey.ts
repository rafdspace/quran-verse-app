import type { Verse } from "../types/verse";

export async function fetchVerseByKey(
  verseKey: string,
  translationId: string,
): Promise<Verse> {
  const url = new URL(`${BACKEND_HOST}/verse/${verseKey}`);

  if (translationId) {
    url.searchParams.set("translationId", translationId);
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch verse");
  }

  return (await res.json()) as Verse;
}
