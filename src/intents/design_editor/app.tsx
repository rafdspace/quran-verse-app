import { useFeatureSupport } from "@canva/app-hooks";
import {
  Button,
  FormField,
  Placeholder,
  Rows,
  Select,
} from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import * as styles from "styles/components.css";

import { getChapters } from "./repositories/getChapters";
import { fetchVerseByKey } from "./repositories/getVerseByKey";
import { fetchTranslations } from "./repositories/getTranslations";

import type { Chapter } from "./types/chapter";
import type { Verse } from "./types/verse";
import type { Translation } from "./types/translation";
import { capitalizeFirstLetter } from "./utils/capitalizeFirstChar";
import PlaceholderView from "./components/PlaceholderView";
import PreviewBox from "./components/PreviewBox";
import { removeHtmlTags } from "./utils/removeHtmlTags";
import { VERSE_MESSAGES } from "./constants";

export const App = () => {
  const intl = useIntl();
  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  const userLocale = intl.locale;

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isVerseLoading, setIsVerseLoading] = useState<boolean>(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [verse, setVerse] = useState<Verse>({} as Verse);

  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<string>("");
  const [selectedTranslation, setSelectedTranslation] = useState<string>("");

  const loadInitialData = useCallback(async () => {
    setIsInitialLoading(true);

    try {
      const [chaptersData, translationsData] = await Promise.all([
        getChapters({ language: userLocale }),
        fetchTranslations({ language: userLocale }),
      ]);

      setChapters(chaptersData);
      setTranslations(translationsData);

      if (chaptersData.length > 0) {
        setSelectedChapter(chaptersData[0]!.id.toString());
        setSelectedVerseNumber("1");
      }
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!selectedChapter || !selectedVerseNumber) return;

    const verseKey = `${selectedChapter}:${selectedVerseNumber}`;

    const fetchVerse = async () => {
      setIsVerseLoading(true);

      try {
        const data = await fetchVerseByKey({
          verseKey,
          translationId: selectedTranslation || "",
          language: userLocale,
        });
        setVerse(data);
      } finally {
        setIsVerseLoading(false);
      }
    };

    fetchVerse();
  }, [selectedChapter, selectedVerseNumber, selectedTranslation]);

  const translationOptions = useMemo(
    () => [
      {
        value: "",
        label: intl.formatMessage({
          defaultMessage: "No translation",
          description: "Option label to disable verse translation",
        }),
      },
      ...translations
        .filter((t) => t.language_name?.trim())
        .sort((a, b) =>
          a.language_name.localeCompare(b.language_name, "en", {
            sensitivity: "base",
          }),
        )
        .map((t) => ({
          value: t.id.toString(),
          label: capitalizeFirstLetter(`${t.language_name} — ${t.name}`),
        })),
    ],
    [translations, intl],
  );

  const chaptersOptions = chapters.map((chapter) => ({
    value: chapter.id.toString(),
    label: chapter.name_simple,
  }));

  const verseNumberOptions = useMemo(() => {
    if (!selectedChapter) return [];

    const chapter = chapters.find((c) => c.id.toString() === selectedChapter);
    if (!chapter) return [];

    const verseCount = chapter.verses_count;

    return Object.entries(VERSE_MESSAGES)
      .slice(0, verseCount)
      .map(([key, message]) => ({
        label: message,
        value: key,
      }));
  }, [chapters, selectedChapter]);

  const textUthmani = verse?.text_uthmani || "";
  const translationText = removeHtmlTags(
    (selectedTranslation && verse.translations?.[0]?.text) || "",
  );

  return (
    <div className={styles.scrollContainer}>
      {isInitialLoading ? (
        <PlaceholderView />
      ) : (
        <Rows spacing="2u">
          {isVerseLoading ? (
            <div
              style={{
                height: "200px",
              }}
            >
              <Placeholder shape="rectangle" />
            </div>
          ) : (
            <PreviewBox text={textUthmani} translations={translationText} />
          )}

          <FormField
            label={intl.formatMessage({
              defaultMessage: "Chapter",
              description: "Label for chapter in quran selection dropdown",
            })}
            control={(props) => (
              <Select
                {...props}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select a chapter",
                  description:
                    "Placeholder for chapter in quran selection dropdown",
                })}
                options={chaptersOptions}
                onChange={(val) => {
                  setSelectedChapter(val);
                  setSelectedVerseNumber("1");
                }}
                value={selectedChapter}
                searchable
                stretch
              />
            )}
          />

          <FormField
            label={intl.formatMessage({
              defaultMessage: "Verse Number",
              description: "Label for verse number in quran selection dropdown",
            })}
            control={(props) => (
              <Select
                {...props}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select a verse number",
                  description:
                    "Placeholder for verse number in quran selection dropdown",
                })}
                options={verseNumberOptions}
                onChange={(val) => setSelectedVerseNumber(val)}
                value={selectedVerseNumber}
                searchable={verseNumberOptions.length > 20}
                stretch
              />
            )}
          />

          <FormField
            label={intl.formatMessage({
              defaultMessage: "Translation",
              description: "Label for translation selection dropdown",
            })}
            labelMarker="optional"
            control={(props) => (
              <Select
                {...props}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select translation",
                  description: "Placeholder for translation selection dropdown",
                })}
                options={translationOptions}
                onChange={(val) => setSelectedTranslation(val)}
                value={selectedTranslation ?? ""}
                searchable
                stretch
              />
            )}
          />

          <Button
            variant="primary"
            onClick={() => {
              if (!addElement) return;
              addElement({
                type: "text",
                children: [textUthmani],
                fontSize: 32,
                textAlign: "justify",
              });

              if (translationText) {
                addElement({
                  type: "text",
                  children: [translationText],
                  fontSize: 31,
                  textAlign: "justify",
                });
              }
            }}
            disabled={!addElement}
            stretch
          >
            {intl.formatMessage({
              defaultMessage: "Generate",
              description:
                "Button to generate the selected verse and translation",
            })}
          </Button>
        </Rows>
      )}
    </div>
  );
};
