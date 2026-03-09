import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Typography } from '@/src/components/Typography';
import { colors } from '@/src/theme/colors';
import { useI18n } from '@/src/i18n';
import type { ReportTotalLearns } from '@/src/api/types';

interface StatsGridProps {
  stats: ReportTotalLearns | null | undefined;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const { t } = useI18n();

  const hours = stats ? Math.round(stats.time_learn / 3600) : 0;

  const items = [
    {
      icon: 'fire' as const,
      label: t('home.dailyStreak'),
      value: stats?.continuous_day ?? 0,
      color: '#FF6B35',
      bg: '#FFF0E8',
    },
    {
      icon: 'book-open-variant' as const,
      label: t('home.wordsLearned'),
      value: stats?.total_word_good ?? 0,
      color: '#E6A817',
      bg: '#FFF8E0',
    },
    {
      icon: 'clock-outline' as const,
      label: t('home.totalHours'),
      value: hours,
      color: '#3D8A5A',
      bg: '#E8F5EE',
    },
    {
      icon: 'microphone' as const,
      label: t('home.goodSpeaking'),
      value: stats?.total_speak_good ?? 0,
      color: '#5B7FD6',
      bg: '#EBF0FC',
    },
  ];

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={[styles.card, { backgroundColor: item.bg }]}>
          <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
            <MaterialCommunityIcons name={item.icon} size={16} color="#FFF" />
          </View>
          <View style={styles.textCol}>
            <Typography size={12} color={colors.onSurfaceVariant}>
              {item.label}
            </Typography>
            <Typography size={22} weight="700" color={item.color}>
              {item.value}
            </Typography>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
});
