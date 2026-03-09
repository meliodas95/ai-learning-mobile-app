import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Typography } from '@/src/components/Typography';
import { colors } from '@/src/theme/colors';

interface Segment {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  activeValue: string;
  onValueChange: (value: string) => void;
}

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.5 };
const PADDING = 4;
const GAP = 4;

export function SegmentedControl({ segments, activeValue, onValueChange }: SegmentedControlProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = segments.findIndex((s) => s.value === activeValue);

  const segmentWidth =
    containerWidth > 0
      ? (containerWidth - PADDING * 2 - GAP * (segments.length - 1)) / segments.length
      : 0;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const indicatorStyle = useAnimatedStyle(() => {
    if (segmentWidth <= 0) return { opacity: 0 };
    const translateX = PADDING + activeIndex * (segmentWidth + GAP);
    return {
      opacity: 1,
      width: segmentWidth,
      transform: [{ translateX: withSpring(translateX, SPRING_CONFIG) }],
    };
  }, [activeIndex, segmentWidth]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      {segments.map((segment) => {
        const isActive = segment.value === activeValue;
        return (
          <Pressable
            key={segment.value}
            style={styles.segment}
            onPress={() => onValueChange(segment.value)}
          >
            <Typography
              size={13}
              weight={isActive ? '600' : '500'}
              color={isActive ? colors.onSurface : colors.textTertiary}
            >
              {segment.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: PADDING,
    gap: GAP,
    backgroundColor: colors.surfaceVariant,
  },
  indicator: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    borderRadius: 8,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 8,
  },
});
