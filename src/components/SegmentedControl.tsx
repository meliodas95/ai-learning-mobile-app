import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
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

export function SegmentedControl({ segments, activeValue, onValueChange }: SegmentedControlProps) {
  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceVariant }]}>
      {segments.map((segment) => {
        const isActive = segment.value === activeValue;
        return (
          <Pressable
            key={segment.value}
            style={[
              styles.segment,
              isActive && [styles.activeSegment, { backgroundColor: colors.surface }],
            ]}
            onPress={() => onValueChange(segment.value)}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.onSurface : colors.textTertiary },
                isActive && styles.activeLabel,
              ]}
            >
              {segment.label}
            </Text>
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
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 8,
  },
  activeSegment: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  activeLabel: {
    fontWeight: '600',
  },
});
