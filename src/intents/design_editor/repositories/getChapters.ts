import type { Chapter } from "../types/chapter";

interface Props {
  language?: string;
}

export async function getChapters({ language = "en" }: Props = {}): Promise<
  Chapter[]
> {
  const query = new URLSearchParams({
    language,
  }).toString();

  const res = await fetch(`${BACKEND_HOST}/chapters?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chapters");
  }

  return (await res.json()) as Chapter[];
}
