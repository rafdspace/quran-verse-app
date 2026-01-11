import { API_BASE_URL } from "../constants";
import type { Chapter } from "../types/chapter";

export async function getChapters(): Promise<Chapter[]> {
  const res = await fetch(`${API_BASE_URL}/chapters`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chapters");
  }

  return (await res.json()) as Chapter[];
}
