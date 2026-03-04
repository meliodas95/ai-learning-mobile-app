import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { ExerciseQuestion, ExerciseAnswer } from '@/src/api/types';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface QuizCardProps {
  question: ExerciseQuestion;
  answers: ExerciseAnswer[];
  selectedAnswer: ExerciseAnswer | null;
  isAnswered: boolean;
  questionIndex: number;
  totalQuestions: number;
  onSelectAnswer: (answer: ExerciseAnswer) => void;
  onNext: () => void;
}

export function QuizCard({
  question,
  answers,
  selectedAnswer,
  isAnswered,
  questionIndex,
  totalQuestions,
  onSelectAnswer,
  onNext,
}: QuizCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const getAnswerStyle = (answer: ExerciseAnswer) => {
    if (!isAnswered) {
      return { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface };
    }
    if (answer.is_correct) {
      return { borderColor: colors.success, backgroundColor: '#E8F5E9' };
    }
    if (selectedAnswer?.id === answer.id && !answer.is_correct) {
      return { borderColor: colors.error, backgroundColor: '#FFEBEE' };
    }
    return { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface };
  };

  return (
    <View style={styles.container}>
      {/* Progress */}
      <Text
        variant="labelMedium"
        style={[styles.progress, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('learn.questionOf', { current: questionIndex + 1, total: totalQuestions })}
      </Text>

      {/* Question */}
      <Card style={[styles.questionCard, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {question.content}
          </Text>
        </Card.Content>
      </Card>

      {/* Answers */}
      <View style={styles.answers}>
        {answers.map((answer) => {
          const answerStyle = getAnswerStyle(answer);
          return (
            <Pressable key={answer.id} onPress={() => onSelectAnswer(answer)} disabled={isAnswered}>
              <View
                style={[
                  styles.answerCard,
                  {
                    borderColor: answerStyle.borderColor,
                    backgroundColor: answerStyle.backgroundColor,
                  },
                ]}
              >
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, flex: 1 }}>
                  {answer.content}
                </Text>
                {isAnswered && answer.is_correct && (
                  <MaterialCommunityIcons name="check-circle" size={20} color="#43A047" />
                )}
                {isAnswered && selectedAnswer?.id === answer.id && !answer.is_correct && (
                  <MaterialCommunityIcons name="close-circle" size={20} color="#E53935" />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Feedback */}
      {isAnswered && (
        <View style={styles.feedback}>
          <Text
            variant="titleSmall"
            style={{ color: selectedAnswer?.is_correct ? colors.success : colors.error }}
          >
            {selectedAnswer?.is_correct ? t('learn.correct') : t('learn.incorrect')}
          </Text>
          <Button mode="contained" onPress={onNext} style={styles.nextButton}>
            {t('common.next')}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  progress: { textAlign: 'center', marginBottom: 16 },
  questionCard: { borderRadius: 12, marginBottom: 24 },
  answers: { gap: 8 },
  answerCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedback: { alignItems: 'center', marginTop: 24 },
  nextButton: { marginTop: 12, borderRadius: 12 },
});
