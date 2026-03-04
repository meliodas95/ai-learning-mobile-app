import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useExercise } from './useExercise';
import { QuizCard } from './QuizCard';
import { ExerciseResult } from './ExerciseResult';
import type { ExerciseQuestion } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Placeholder - in real app, questions come from API
const MOCK_QUESTIONS: ExerciseQuestion[] = [];

export function ExerciseView() {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    currentQuestion,
    shuffledAnswers,
    selectedAnswer,
    isAnswered,
    correctCount,
    totalQuestions,
    currentQuestionIndex,
    isFinished,
    selectAnswer,
    nextQuestion,
    restart,
  } = useExercise(MOCK_QUESTIONS);

  if (totalQuestions === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={48} color={theme.colors.outline} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
          No exercises available for this lesson
        </Text>
      </View>
    );
  }

  if (isFinished) {
    return <ExerciseResult correctCount={correctCount} totalQuestions={totalQuestions} onRestart={restart} />;
  }

  if (!currentQuestion) return null;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <QuizCard
        question={currentQuestion}
        answers={shuffledAnswers}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        questionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onSelectAnswer={selectAnswer}
        onNext={nextQuestion}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scrollContent: { flexGrow: 1 },
});
