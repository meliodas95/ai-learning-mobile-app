import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import type { AVPlaybackStatus } from 'expo-av';
import { Video, ResizeMode } from 'expo-av';

export interface VideoPlayerRef {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  getStatus: () => Promise<AVPlaybackStatus | null>;
}

interface VideoPlayerProps {
  uri: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnd?: () => void;
  onReady?: () => void;
  onError?: (error: string) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ uri, onProgress, onEnd, onReady, onError }, ref) => {
    const videoRef = useRef<Video>(null);

    useImperativeHandle(ref, () => ({
      play: async () => {
        await videoRef.current?.playAsync();
      },
      pause: async () => {
        await videoRef.current?.pauseAsync();
      },
      seekTo: async (positionMillis: number) => {
        await videoRef.current?.setPositionAsync(positionMillis);
      },
      getStatus: async () => {
        return (await videoRef.current?.getStatusAsync()) ?? null;
      },
    }));

    const handlePlaybackStatusUpdate = useCallback(
      (status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
          if (status.error) {
            onError?.(status.error);
          }
          return;
        }
        if (status.isPlaying && onProgress) {
          onProgress(
            status.positionMillis / 1000,
            status.durationMillis ? status.durationMillis / 1000 : 0,
          );
        }
        if (status.didJustFinish) {
          onEnd?.();
        }
      },
      [onProgress, onEnd, onError],
    );

    return (
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoad={() => onReady?.()}
        />
      </View>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
