import { View, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme } from 'react-native-paper';
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
        <Text variant="headlineMedium" style={[styles.word, { color: theme.colors.primary }]}>
          {word}
        </Text>

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
                <Text
                  variant="bodyMedium"
                  style={[styles.pronunciation, { color: theme.colors.secondary }]}
                >
                  /{definition.phonetic}/
                </Text>
              </View>
            )}

            {/* Part of speech */}
            {definition.pos && (
              <Text
                variant="labelMedium"
                style={[styles.pos, { color: theme.colors.onSurfaceVariant }]}
              >
                {definition.pos}
              </Text>
            )}

            {/* Definition */}
            {definition.definition && (
              <View style={styles.definitionRow}>
                <Text
                  variant="bodyMedium"
                  style={[styles.definitionText, { color: theme.colors.onSurface }]}
                >
                  {definition.definition}
                </Text>
              </View>
            )}
            {definition.definition_vi && (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
              >
                {definition.definition_vi}
              </Text>
            )}

            {/* Example */}
            {definition.example && (
              <Text
                variant="bodySmall"
                style={[styles.example, { color: theme.colors.onSurfaceVariant }]}
              >
                "{definition.example}"
              </Text>
            )}
          </>
        )}

        {!definition && !isLoading && (
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}
          >
            {t('learn.noDefinition')}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, borderRadius: 16 },
  word: { fontWeight: '700', textAlign: 'center', marginBottom: 8 },
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
