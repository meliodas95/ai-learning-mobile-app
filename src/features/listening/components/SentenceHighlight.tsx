import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import { useI18n } from '@/src/i18n';
import { useSettingsStore } from '@/src/store/settingsStore';
import type { SentenceEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface SentenceHighlightProps {
  sentence: SentenceEntity | undefined;
  sentenceIndex: number;
  totalSentences: number;
}

export function SentenceHighlight({
  sentence,
  sentenceIndex,
  totalSentences,
}: SentenceHighlightProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const showTranslation = useSettingsStore((s) => s.showTranslation);

  if (!sentence) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Typography size={14} color={theme.colors.onSurfaceVariant} style={{ textAlign: 'center' }}>
          ...
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      {/* Character name */}
      {sentence.character_name && (
        <View style={styles.characterRow}>
          <MaterialCommunityIcons name="account" size={16} color={theme.colors.primary} />
          <Typography size={12} color={theme.colors.primary} style={{ marginLeft: 4 }}>
            {sentence.character_name}
          </Typography>
        </View>
      )}

      {/* Sentence content */}
      <Typography size={18} color={theme.colors.onSurface} style={styles.content}>
        {sentence.content}
      </Typography>

      {/* Translation */}
      {showTranslation && sentence.translation?.translate_google && (
        <Typography size={12} color={theme.colors.onSurfaceVariant} style={styles.translation}>
          {sentence.translation.translate_google}
        </Typography>
      )}

      {/* Progress */}
      <Typography size={11} color={theme.colors.onSurfaceVariant} style={styles.progress}>
        {t('learn.sentenceOf', { current: sentenceIndex + 1, total: totalSentences })}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 12, margin: 16 },
  characterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  content: { lineHeight: 28 },
  translation: { marginTop: 8, fontStyle: 'italic' },
  progress: { marginTop: 12, textAlign: 'center' },
});
