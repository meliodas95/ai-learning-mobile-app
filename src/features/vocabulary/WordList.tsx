import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/i18n';
import { useEffect } from 'react';
import { useVocabulary } from './useVocabulary';
import { WordCard } from './WordCard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export function WordList() {
  const theme = useTheme();
  const { t } = useI18n();

  const {
    words,
    currentWordIndex,
    currentWord,
    definition,
    isLoadingDefinition,
    isFinished,
    nextWord,
    prevWord,
    lookupWord,
  } = useVocabulary();

  // Lookup word when it changes
  useEffect(() => {
    if (currentWord) {
      lookupWord(currentWord);
    }
  }, [currentWord, lookupWord]);

  if (words.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="book-open-variant" size={48} color={theme.colors.outline} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
          {t('learn.noVocabulary')}
        </Text>
      </View>
    );
  }

  if (isFinished) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="check-circle" size={64} color={theme.colors.primary} />
        <Text variant="headlineSmall" style={{ color: theme.colors.primary, marginTop: 16 }}>
          {t('learn.finishLesson')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Word Card */}
      <View style={styles.cardContainer}>
        <WordCard word={currentWord} definition={definition} isLoading={isLoadingDefinition} />
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {words.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === currentWordIndex ? theme.colors.primary : theme.colors.outline,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <IconButton
          icon="chevron-left"
          size={32}
          onPress={prevWord}
          disabled={currentWordIndex === 0}
        />
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {currentWordIndex + 1} / {words.length}
        </Text>
        <IconButton icon="chevron-right" size={32} onPress={nextWord} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  cardContainer: { flex: 1, justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
});
