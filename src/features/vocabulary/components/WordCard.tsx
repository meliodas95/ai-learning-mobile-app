import { View, StyleSheet } from 'react-native';
import { Card, ActivityIndicator, useTheme } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import { useI18n } from '@/src/i18n';
import type { DictionaryWord } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface WordCardProps {
  word: string;
  definition: DictionaryWord | null;
  isLoading: boolean;
}

export function WordCard({ word, definition, isLoading }: WordCardProps) {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        {/* Word */}
        <Typography size={28} weight="700" color={theme.colors.primary} style={styles.word}>
          {word}
        </Typography>

        {isLoading && <ActivityIndicator style={styles.loader} />}

        {definition && (
          <>
            {/* Pronunciation */}
            {definition.phonetic && (
              <View style={styles.pronunciationRow}>
                <MaterialCommunityIcons
                  name="volume-high"
                  size={18}
                  color={theme.colors.secondary}
                />
                <Typography size={14} color={theme.colors.secondary} style={styles.pronunciation}>
                  /{definition.phonetic}/
                </Typography>
              </View>
            )}

            {/* Part of speech */}
            {definition.pos && (
              <Typography size={12} color={theme.colors.onSurfaceVariant} style={styles.pos}>
                {definition.pos}
              </Typography>
            )}

            {/* Definition */}
            {definition.definition && (
              <View style={styles.definitionRow}>
                <Typography size={14} color={theme.colors.onSurface} style={styles.definitionText}>
                  {definition.definition}
                </Typography>
              </View>
            )}
            {definition.definition_vi && (
              <Typography size={12} color={theme.colors.onSurfaceVariant} style={{ marginTop: 2 }}>
                {definition.definition_vi}
              </Typography>
            )}

            {/* Example */}
            {definition.example && (
              <Typography size={12} color={theme.colors.onSurfaceVariant} style={styles.example}>
                "{definition.example}"
              </Typography>
            )}
          </>
        )}

        {!definition && !isLoading && (
          <Typography size={14} color={theme.colors.onSurfaceVariant} style={{ marginTop: 12 }}>
            {t('learn.noDefinition')}
          </Typography>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, borderRadius: 16 },
  word: { textAlign: 'center', marginBottom: 8 },
  loader: { marginVertical: 24 },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pronunciation: { marginLeft: 6, fontStyle: 'italic' },
  pos: { textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  definitionRow: { flexDirection: 'row', marginBottom: 4, gap: 6 },
  definitionText: { flex: 1 },
  example: { fontStyle: 'italic', marginTop: 4, marginLeft: 16 },
});
