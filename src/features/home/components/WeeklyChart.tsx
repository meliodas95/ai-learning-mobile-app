import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Typography } from '@/src/components/Typography';
import { colors } from '@/src/theme/colors';
import { useI18n } from '@/src/i18n';
import type { ReportLearnItem } from '@/src/api/types';

interface WeeklyChartProps {
  data: ReportLearnItem[] | undefined;
}

const DAY_LABELS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BAR_MAX_HEIGHT = 120;

function getWeekDays(): Date[] {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function Bar({
  height,
  maxHeight,
  isToday,
}: {
  height: number;
  maxHeight: number;
  isToday: boolean;
}) {
  const barHeight = maxHeight > 0 ? Math.max((height / maxHeight) * BAR_MAX_HEIGHT, 4) : 4;

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(barHeight, { duration: 600 }),
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        animatedStyle,
        { backgroundColor: isToday ? colors.primary : colors.primaryLight },
      ]}
    />
  );
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { t, locale } = useI18n();
  const dayLabels = locale === 'vi' ? DAY_LABELS_VI : DAY_LABELS_EN;

  const weekData = useMemo(() => {
    const days = getWeekDays();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return days.map((date, i) => {
      const dayStart = Math.floor(date.getTime() / 1000);
      const dayEnd = dayStart + 86400;
      const minutes =
        (data ?? [])
          .filter((r) => r.created_at >= dayStart && r.created_at < dayEnd)
          .reduce((sum, r) => sum + r.amount, 0) / 60;

      return {
        label: dayLabels[i],
        minutes: Math.round(minutes),
        isToday: date.getTime() === today.getTime(),
      };
    });
  }, [data, dayLabels]);

  const maxMinutes = Math.max(...weekData.map((d) => d.minutes), 1);
  const totalMinutes = weekData.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography size={16} weight="600">
          {t('home.weeklyStudyTime')}
        </Typography>
        <Typography size={13} color={colors.onSurfaceVariant}>
          {totalMinutes} {t('home.minutes')}
        </Typography>
      </View>

      <View style={styles.chartArea}>
        {weekData.map((day) => (
          <View key={day.label} style={styles.barCol}>
            <Typography size={10} color={colors.onSurfaceVariant} style={styles.barValue}>
              {day.minutes > 0 ? day.minutes : ''}
            </Typography>
            <View style={styles.barTrack}>
              <Bar height={day.minutes} maxHeight={maxMinutes} isToday={day.isToday} />
            </View>
            <Typography
              size={11}
              weight={day.isToday ? '600' : '400'}
              color={day.isToday ? colors.primary : colors.onSurfaceVariant}
            >
              {day.label}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: BAR_MAX_HEIGHT + 40,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barTrack: {
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 24,
    borderRadius: 6,
    minHeight: 4,
  },
  barValue: {
    height: 14,
  },
});
