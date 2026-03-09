import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import { useI18n } from '@/src/i18n';
import { formatDuration } from '@/src/utils/formatters';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface RecordButtonProps {
  isRecording: boolean;
  recordingDuration: number;
  transcript: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function RecordButton({
  isRecording,
  recordingDuration,
  transcript,
  onStartRecording,
  onStopRecording,
}: RecordButtonProps) {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      {/* Transcript display */}
      {transcript ? (
        <Typography size={14} color={theme.colors.onSurface} style={styles.transcript}>
          {transcript}
        </Typography>
      ) : isRecording ? (
        <Typography size={14} color={theme.colors.onSurfaceVariant} style={styles.transcript}>
          {t('learn.recording')}
        </Typography>
      ) : null}

      {/* Duration */}
      {isRecording && (
        <Typography size={14} weight="600" color={theme.colors.error} style={styles.duration}>
          {formatDuration(recordingDuration)}
        </Typography>
      )}

      {/* Record button */}
      <Pressable
        onPress={isRecording ? onStopRecording : onStartRecording}
        style={[
          styles.button,
          { backgroundColor: isRecording ? theme.colors.error : theme.colors.primary },
        ]}
      >
        <MaterialCommunityIcons name={isRecording ? 'stop' : 'microphone'} size={32} color="#FFF" />
      </Pressable>

      {!isRecording && (
        <Typography size={12} color={theme.colors.onSurfaceVariant} style={{ marginTop: 8 }}>
          {t('learn.tapToRecord')}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 16 },
  transcript: {
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    minHeight: 24,
  },
  duration: { marginBottom: 12 },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
