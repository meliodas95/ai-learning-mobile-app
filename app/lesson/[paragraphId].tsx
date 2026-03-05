import React, { useEffect, Suspense } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useParagraphDetail } from '@/src/api/hooks/useCourses';
import { useSentences } from '@/src/api/hooks/useSentences';
import { useLearningStore } from '@/src/store/learningStore';
import { LessonTabBar } from '@/src/components/LessonTabBar';
import { LearnTab } from '@/src/api/types';
import { PROCESS_QUIZ_COMPLETED } from '@/src/constants';

const ListeningPlayer = React.lazy(() =>
  import('@/src/features/listening/ListeningPlayer').then((m) => ({ default: m.ListeningPlayer })),
);
const SpeakingPlayer = React.lazy(() =>
  import('@/src/features/speaking/SpeakingPlayer').then((m) => ({ default: m.SpeakingPlayer })),
);
const WordList = React.lazy(() =>
  import('@/src/features/vocabulary/WordList').then((m) => ({ default: m.WordList })),
);
const ExerciseView = React.lazy(() =>
  import('@/src/features/exercise/ExerciseView').then((m) => ({ default: m.ExerciseView })),
);

export default function LessonScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { paragraphId } = useLocalSearchParams<{ paragraphId: string }>();
  const numId = paragraphId ? Number(paragraphId) : undefined;

  const {
    data: paragraphData,
    isLoading: loadingParagraph,
    error: paragraphError,
  } = useParagraphDetail(numId);
  const { data: sentenceData, isLoading: loadingSentences } = useSentences(
    numId ? { paragraph_id: numId, type: 'listen' } : undefined,
  );

  const activeTab = useLearningStore((s) => s.activeTab);
  const setParagraph = useLearningStore((s) => s.setParagraph);
  const setSentences = useLearningStore((s) => s.setSentences);
  const reset = useLearningStore((s) => s.reset);

  // Initialize store when data loads
  useEffect(() => {
    if (paragraphData?.paragraph) {
      setParagraph(paragraphData.paragraph);
    }
  }, [paragraphData, setParagraph]);

  useEffect(() => {
    if (sentenceData?.sentences && sentenceData?.characters) {
      setSentences(sentenceData.sentences, sentenceData.characters);
    }
  }, [sentenceData, setSentences]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const isLoading = loadingParagraph || loadingSentences;
  const paragraph = paragraphData?.paragraph;
  const hasKeywords = !!paragraph?.keywords;
  const hasExercise = paragraph?.process_quiz === PROCESS_QUIZ_COMPLETED;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}
          >
            {t('common.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (paragraphError || !paragraph) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loading}>
          <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
            {t('common.error')}
          </Text>
          <IconButton icon="arrow-left" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case LearnTab.LISTEN:
        return <ListeningPlayer />;
      case LearnTab.SPEAKING:
        return <SpeakingPlayer />;
      case LearnTab.WORD:
        return <WordList />;
      case LearnTab.EXERCISE:
        return <ExerciseView />;
      default:
        return <ListeningPlayer />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurface, flex: 1 }}
          numberOfLines={1}
        >
          {paragraph.title}
        </Text>
      </View>

      {/* Tab Bar */}
      <LessonTabBar hasKeywords={hasKeywords} hasExercise={hasExercise} />

      {/* Active Tab Content */}
      <View style={styles.content}>
        <Suspense fallback={<ActivityIndicator size="large" style={{ flex: 1 }} />}>
          {renderActiveTab()}
        </Suspense>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: 16 },
  content: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
