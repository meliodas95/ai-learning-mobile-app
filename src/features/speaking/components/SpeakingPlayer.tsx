import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, IconButton, useTheme, Surface } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import { useI18n } from '@/src/i18n';
import { useSpeakingFlow } from '../hooks/useSpeakingFlow';
import { RecordButton } from './RecordButton';
import { ScoreDisplay } from './ScoreDisplay';
import { CountdownOverlay } from './CountdownOverlay';
import { SpeakingState } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export function SpeakingPlayer() {
  const theme = useTheme();
  const { t } = useI18n();

  const {
    state,
    currentSentence,
    isRecording,
    transcript,
    recordingDuration,
    score,
    sentenceIndex,
    totalSentences,
    startLesson,
    startRecording,
    stopAndScore,
    nextSentence,
    prevSentence,
    restartLesson,
  } = useSpeakingFlow();

  // Idle / start state
  if (state === SpeakingState.IDLE) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="microphone" size={64} color={theme.colors.primary} />
        <Typography size={22} color={theme.colors.primary} style={{ marginTop: 16 }}>
          {t('learn.speaking')}
        </Typography>
        <Button
          mode="contained"
          onPress={startLesson}
          style={styles.mainButton}
          contentStyle={{ height: 48 }}
        >
          {t('learn.startLesson')}
        </Button>
      </View>
    );
  }

  // Finished state
  if (state === SpeakingState.FINISHED) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="check-circle" size={64} color={theme.colors.primary} />
        <Typography size={24} color={theme.colors.primary} style={{ marginTop: 16 }}>
          {t('learn.finishLesson')}
        </Typography>
        <Button mode="contained" onPress={restartLesson} style={styles.mainButton}>
          {t('common.retry')}
        </Button>
      </View>
    );
  }

  // Countdown state
  if (state === SpeakingState.COUNTDOWN) {
    return <CountdownOverlay onComplete={startRecording} />;
  }

  // Scored state
  if (state === SpeakingState.SCORED && currentSentence && score !== null && score !== undefined) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScoreDisplay
          score={score}
          template={currentSentence.content}
          transcript={transcript}
          onNext={nextSentence}
          onRetry={() => {
            // Go back to countdown for retry
            startLesson();
          }}
        />
      </ScrollView>
    );
  }

  // Scoring state
  if (state === SpeakingState.SCORING) {
    return (
      <View style={styles.centerContainer}>
        <Typography color={theme.colors.onSurfaceVariant}>{t('common.loading')}</Typography>
      </View>
    );
  }

  // Listening / Recording states
  return (
    <View style={styles.container}>
      {/* Sentence display */}
      <Surface
        style={[styles.sentenceCard, { backgroundColor: theme.colors.surfaceVariant }]}
        elevation={0}
      >
        {currentSentence?.character_name && (
          <View style={styles.characterRow}>
            <MaterialCommunityIcons name="account" size={16} color={theme.colors.primary} />
            <Typography size={12} color={theme.colors.primary} style={{ marginLeft: 4 }}>
              {currentSentence.character_name}
            </Typography>
          </View>
        )}
        <Typography size={18} color={theme.colors.onSurface} style={{ lineHeight: 28 }}>
          {currentSentence?.content ?? ''}
        </Typography>
      </Surface>

      {/* Status indicator */}
      {state === SpeakingState.LISTENING && (
        <View style={styles.listeningIndicator}>
          <MaterialCommunityIcons name="volume-high" size={24} color={theme.colors.primary} />
          <Typography size={14} color={theme.colors.primary} style={{ marginLeft: 8 }}>
            {t('learn.listening')}
          </Typography>
        </View>
      )}

      {/* Record button (only for recording state) */}
      {state === SpeakingState.RECORDING && (
        <RecordButton
          isRecording={isRecording}
          recordingDuration={recordingDuration}
          transcript={transcript}
          onStartRecording={startRecording}
          onStopRecording={stopAndScore}
        />
      )}

      {/* Navigation */}
      <View style={styles.navigation}>
        <IconButton
          icon="skip-previous"
          size={28}
          onPress={prevSentence}
          disabled={sentenceIndex === 0}
        />
        <Typography size={12} color={theme.colors.onSurfaceVariant}>
          {t('learn.sentenceOf', { current: sentenceIndex + 1, total: totalSentences })}
        </Typography>
        <IconButton
          icon="skip-next"
          size={28}
          onPress={nextSentence}
          disabled={sentenceIndex >= totalSentences - 1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContent: { flexGrow: 1 },
  mainButton: { marginTop: 32, borderRadius: 12 },
  sentenceCard: { margin: 16, padding: 16, borderRadius: 12 },
  characterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listeningIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
});
