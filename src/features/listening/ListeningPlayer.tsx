import { View, StyleSheet } from 'react-native';
import { IconButton, Button, Text, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/i18n';
import { VideoPlayer } from '@/src/components/VideoPlayer';
import { SentenceHighlight } from './SentenceHighlight';
import { useListening } from './useListening';
import { useLearningStore } from '@/src/store/learningStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export function ListeningPlayer() {
  const theme = useTheme();
  const { t } = useI18n();
  const paragraph = useLearningStore((s) => s.paragraph);

  const {
    currentSentence,
    isPlaying,
    isStarted,
    isFinished,
    sentenceIndex,
    totalSentences,
    handleProgress,
    handleStart,
    handleNextSentence,
    handleBackSentence,
    handleTogglePlay,
    handleFinish,
    handleRestart,
    videoRef,
  } = useListening();

  // Get video URL from first audio or paragraph
  const videoUrl = currentSentence?.audios?.[0]?.url ?? '';

  if (isFinished) {
    return (
      <View style={styles.finishContainer}>
        <MaterialCommunityIcons name="check-circle" size={64} color={theme.colors.primary} />
        <Text variant="headlineSmall" style={{ color: theme.colors.primary, marginTop: 16 }}>
          {t('learn.finishLesson')}
        </Text>
        <Button mode="contained" onPress={handleRestart} style={styles.restartButton}>
          {t('common.retry')}
        </Button>
      </View>
    );
  }

  if (!isStarted) {
    return (
      <View style={styles.startContainer}>
        <MaterialCommunityIcons name="headphones" size={64} color={theme.colors.primary} />
        <Text variant="titleLarge" style={{ color: theme.colors.primary, marginTop: 16 }}>
          {paragraph?.title}
        </Text>
        <Button
          mode="contained"
          onPress={handleStart}
          style={styles.startButton}
          contentStyle={{ height: 48 }}
        >
          {t('learn.startLesson')}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Video Player */}
      {videoUrl ? (
        <VideoPlayer
          ref={videoRef}
          uri={videoUrl}
          onProgress={handleProgress}
          onEnd={handleFinish}
        />
      ) : (
        <View style={[styles.videoPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons
            name="video-off"
            size={48}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      )}

      {/* Sentence Display */}
      <SentenceHighlight
        sentence={currentSentence}
        sentenceIndex={sentenceIndex}
        totalSentences={totalSentences}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <IconButton
          icon="skip-previous"
          size={32}
          onPress={handleBackSentence}
          disabled={sentenceIndex === 0}
        />
        <IconButton
          icon={isPlaying ? 'pause-circle' : 'play-circle'}
          size={48}
          iconColor={theme.colors.primary}
          onPress={handleTogglePlay}
        />
        <IconButton
          icon="skip-next"
          size={32}
          onPress={handleNextSentence}
          disabled={sentenceIndex >= totalSentences - 1}
        />
      </View>

      {/* Finish button */}
      {sentenceIndex >= totalSentences - 1 && (
        <Button mode="contained" onPress={handleFinish} style={styles.finishButton}>
          {t('learn.finishLesson')}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  startContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  startButton: { marginTop: 32, borderRadius: 12 },
  finishContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  restartButton: { marginTop: 24, borderRadius: 12 },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  finishButton: { marginHorizontal: 16, marginTop: 8, borderRadius: 12 },
});
