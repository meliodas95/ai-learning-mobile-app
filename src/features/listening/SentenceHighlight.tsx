import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const showTranslation = useSettingsStore((s) => s.showTranslation);

  if (!sentence) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
        >
          ...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      {/* Character name */}
      {sentence.character_name && (
        <View style={styles.characterRow}>
          <MaterialCommunityIcons name="account" size={16} color={theme.colors.primary} />
          <Text variant="labelMedium" style={{ color: theme.colors.primary, marginLeft: 4 }}>
            {sentence.character_name}
          </Text>
        </View>
      )}

      {/* Sentence content */}
      <Text variant="bodyLarge" style={[styles.content, { color: theme.colors.onSurface }]}>
        {sentence.content}
      </Text>

      {/* Translation */}
      {showTranslation && sentence.translation?.translate_google && (
        <Text
          variant="bodySmall"
          style={[styles.translation, { color: theme.colors.onSurfaceVariant }]}
        >
          {sentence.translation.translate_google}
        </Text>
      )}

      {/* Progress */}
      <Text
        variant="labelSmall"
        style={[styles.progress, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('learn.sentenceOf', { current: sentenceIndex + 1, total: totalSentences })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 12, margin: 16 },
  characterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  content: { fontSize: 18, lineHeight: 28 },
  translation: { marginTop: 8, fontStyle: 'italic' },
  progress: { marginTop: 12, textAlign: 'center' },
});
