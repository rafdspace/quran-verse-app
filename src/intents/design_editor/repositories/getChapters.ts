import type { Chapter } from "../types/chapter";

export async function getChapters(): Promise<Chapter[]> {
  const res = await fetch(`${BACKEND_HOST}/chapters`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chapters");
  }

  return (await res.json()) as Chapter[];
}
