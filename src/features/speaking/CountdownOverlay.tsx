import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface CountdownOverlayProps {
  seconds?: number;
  onComplete: () => void;
}

export function CountdownOverlay({ seconds = 3, onComplete }: CountdownOverlayProps) {
  const theme = useTheme();
  const [count, setCount] = useState(seconds);
  const completedRef = useRef(false);

  useEffect(() => {
    if (count <= 0 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
      return;
    }
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: theme.colors.primary }]}>
        <Text variant="displayLarge" style={styles.number}>
          {count}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: { color: '#FFF', fontWeight: '700' },
});
