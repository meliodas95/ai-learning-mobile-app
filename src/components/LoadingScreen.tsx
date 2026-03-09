import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@/src/theme/colors';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse the loading dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim, pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo */}
        <Image source={require('@/assets/logo.png')} style={styles.logo} resizeMode="contain" />

        {/* Loading indicator */}
        <Animated.View style={[styles.dotsRow, { opacity: pulseAnim }]}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotMiddle]} />
          <View style={styles.dot} />
        </Animated.View>

        {/* Message */}
        {message && <Text style={styles.message}>{message}</Text>}
      </Animated.View>

      {/* Footer */}
      <Text style={styles.footer}>LangEnter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 32,
  },
  logo: {
    width: 240,
    height: 90,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dotMiddle: {
    backgroundColor: '#F0A030',
  },
  message: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    fontSize: 13,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
});
