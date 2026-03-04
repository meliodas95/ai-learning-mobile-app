import { useCallback, useRef, useState, useEffect } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { Audio } from 'expo-av';

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  transcript: string;
  recordingDuration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<{ audioUri: string; transcript: string } | null>;
  cancelRecording: () => Promise<void>;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const transcriptRef = useRef('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      const text = e.value?.[0] ?? '';
      transcriptRef.current = text;
      setTranscript(text);
    };

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      const text = e.value?.[0] ?? '';
      setTranscript(text);
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.warn('Speech recognition error:', e.error);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setTranscript('');
      transcriptRef.current = '';
      setRecordingDuration(0);

      // Request permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) throw new Error('Microphone permission denied');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start audio recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;

      // Start speech recognition
      await Voice.start('en-US');

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);

      setIsRecording(true);
    } catch (error) {
      console.warn('Failed to start recording:', error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      // Stop duration timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Stop speech recognition
      await Voice.stop();

      // Stop audio recording
      const recording = recordingRef.current;
      if (!recording) return null;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      setIsRecording(false);

      if (!uri) return null;

      return {
        audioUri: uri,
        transcript: transcriptRef.current || transcript,
      };
    } catch (error) {
      console.warn('Failed to stop recording:', error);
      setIsRecording(false);
      return null;
    }
  }, [transcript]);

  const cancelRecording = useCallback(async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      await Voice.stop();
      await Voice.cancel();
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      setIsRecording(false);
      setTranscript('');
      setRecordingDuration(0);
    } catch (error) {
      console.warn('Failed to cancel recording:', error);
      setIsRecording(false);
    }
  }, []);

  return {
    isRecording,
    transcript,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
