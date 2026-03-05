import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
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
        <Text variant="bodyMedium" style={[styles.transcript, { color: theme.colors.onSurface }]}>
          {transcript}
        </Text>
      ) : isRecording ? (
        <Text
          variant="bodyMedium"
          style={[styles.transcript, { color: theme.colors.onSurfaceVariant }]}
        >
          {t('learn.recording')}
        </Text>
      ) : null}

      {/* Duration */}
      {isRecording && (
        <Text variant="labelLarge" style={[styles.duration, { color: theme.colors.error }]}>
          {formatDuration(recordingDuration)}
        </Text>
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
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          {t('learn.tapToRecord')}
        </Text>
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
  duration: { marginBottom: 12, fontWeight: '600' },
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
