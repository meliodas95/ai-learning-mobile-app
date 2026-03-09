import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';

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
        <Typography size={57} weight="700" color="#FFF">
          {count}
        </Typography>
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
});
