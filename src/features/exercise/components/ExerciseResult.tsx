import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import { useI18n } from '@/src/i18n';
import { getScoreHex } from '@/src/utils/score';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ExerciseResultProps {
  correctCount: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function ExerciseResult({ correctCount, totalQuestions, onRestart }: ExerciseResultProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const color = getScoreHex(percentage);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={percentage >= 80 ? 'trophy' : percentage >= 50 ? 'star' : 'refresh'}
        size={64}
        color={color}
      />

      <View style={[styles.scoreCircle, { borderColor: color }]}>
        <Typography size={36} weight="700" color={color}>
          {percentage}%
        </Typography>
      </View>

      <Typography color={theme.colors.onSurface} style={{ marginTop: 12 }}>
        {correctCount} / {totalQuestions} {t('learn.correctCount', { count: correctCount })}
      </Typography>

      <Button mode="contained" onPress={onRestart} style={styles.button}>
        {t('learn.tryAgain')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  button: { marginTop: 32, borderRadius: 12 },
});
