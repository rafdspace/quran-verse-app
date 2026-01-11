import { Box, Rows, Scrollable, Text } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";

interface PreviewBoxProps {
  text: string;
  translations: string;
}

const PreviewBox = ({ text, translations }: PreviewBoxProps) => {
  return (
    <Box
      background="neutralLow"
      borderRadius="large"
      padding="1u"
      className={styles.scrollableContainer}
    >
      <Scrollable>
        <div className={styles.previewContainer}>
          <Rows spacing="1u">
            <Text
              alignment="center"
              capitalization="default"
              size="large"
              variant="regular"
            >
              {text}
            </Text>
            {translations && (
              <Text
                alignment="center"
                capitalization="default"
                size="small"
                variant="regular"
              >
                {translations}
              </Text>
            )}
          </Rows>
        </div>
      </Scrollable>
    </Box>
  );
};

export default PreviewBox;
