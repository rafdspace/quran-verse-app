interface VerseWord {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: "word" | "end";
  code_v1: string;
  page_number: number;
  line_number: number;
  text: string;

  translation: {
    text: string | null;
    language_name: string;
  };

  transliteration: {
    text: string | null;
    language_name: string;
  };
}

export type Verse = {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations?: {
    id: number;
    text: string;
  }[];
  words?: VerseWord[];
};
