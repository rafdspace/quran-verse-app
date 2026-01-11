export function removeHtmlTags(input?: string): string {
  if (!input) return "";

  return input.replace(/<[^>]*>.*?<\/[^>]*>|<[^/>]*\/?>/g, "").trim();
}
