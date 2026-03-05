import React, { useEffect, Suspense } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useI18n } from '@/src/i18n';
import { useParagraphDetail } from '@/src/api/hooks/useCourses';
import { useSentences } from '@/src/api/hooks/useSentences';
import { useLearningStore } from '@/src/store/learningStore';
import { LessonTabBar } from '@/src/components/LessonTabBar';
import { LearnTab } from '@/src/api/types';
import { PROCESS_QUIZ_COMPLETED } from '@/src/constants';
import { colors } from '@/src/theme/colors';

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

const PARAGRAPH_TYPE_LABELS: Record<string, string> = {
  conversation: 'Conversation',
  essay: 'Essay',
  gallery: 'Image Lesson',
  video: 'Video',
};

export default function LessonScreen() {
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
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (paragraphError || !paragraph) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{t('common.error')}</Text>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const typeName = PARAGRAPH_TYPE_LABELS[paragraph.item] ?? paragraph.item;

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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {paragraph.title}
        </Text>
        {typeName ? (
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{typeName}</Text>
          </View>
        ) : null}
        <Pressable hitSlop={8}>
          <MaterialCommunityIcons name="dots-vertical" size={22} color={colors.textTertiary} />
        </Pressable>
      </View>

      {/* Tab Bar */}
      <LessonTabBar hasKeywords={hasKeywords} hasExercise={hasExercise} />

      {/* Active Tab Content */}
      <View style={styles.content}>
        <Suspense fallback={<ActivityIndicator size="large" style={styles.content} />}>
          {renderActiveTab()}
        </Suspense>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    color: colors.onSurface,
  },
  typeBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  content: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 16 },
  errorText: { fontSize: 16, color: colors.error, fontWeight: '500' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backButtonText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
});
