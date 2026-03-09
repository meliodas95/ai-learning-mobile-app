import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import { useI18n } from '@/src/i18n';
import { getScoreHex, getScoreMessage } from '@/src/utils/score';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ScoreDisplayProps {
  score: number;
  template: string;
  transcript: string;
  onNext: () => void;
  onRetry: () => void;
}

export function ScoreDisplay({ score, template, transcript, onNext, onRetry }: ScoreDisplayProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const scoreColor = getScoreHex(score);
  const message = getScoreMessage(score);

  return (
    <View style={styles.container}>
      {/* Score circle */}
      <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
        <Typography size={36} weight="700" color={scoreColor}>
          {score}
        </Typography>
      </View>

      {/* Message */}
      <Typography color={scoreColor} style={{ marginTop: 12 }}>
        {t(message)}
      </Typography>

      {/* Template vs transcript */}
      <View style={[styles.comparison, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.comparisonRow}>
          <MaterialCommunityIcons name="text" size={16} color={theme.colors.primary} />
          <Typography size={12} color={theme.colors.onSurfaceVariant} style={{ marginLeft: 4 }}>
            {t('learn.expected')}
          </Typography>
        </View>
        <Typography size={14} color={theme.colors.onSurface}>
          {template}
        </Typography>
        <View style={[styles.comparisonRow, { marginTop: 12 }]}>
          <MaterialCommunityIcons name="microphone" size={16} color={theme.colors.secondary} />
          <Typography size={12} color={theme.colors.onSurfaceVariant} style={{ marginLeft: 4 }}>
            {t('learn.youSaid')}
          </Typography>
        </View>
        <Typography size={14} color={theme.colors.onSurface}>
          {transcript || t('learn.noSpeechDetected')}
        </Typography>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button mode="outlined" onPress={onRetry} style={styles.actionButton}>
          {t('learn.tryAgain')}
        </Button>
        <Button mode="contained" onPress={onNext} style={styles.actionButton}>
          {t('learn.continueLesson')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24 },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comparison: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  actionButton: { flex: 1, borderRadius: 12 },
});
