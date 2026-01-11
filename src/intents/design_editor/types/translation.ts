interface TranslatedName {
  name: string;
  language_name: string;
}

export interface Translation {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: TranslatedName;
}
