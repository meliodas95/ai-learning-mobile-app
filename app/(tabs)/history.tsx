import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useHistory } from '@/src/api/hooks/useHistory';
import { useSettingsStore } from '@/src/store/settingsStore';
import { formatRelativeTime } from '@/src/utils/formatters';
import type { HistoryParagraphEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/src/theme/colors';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function getTypeInfo(type: number): { icon: IconName; label: string } {
  switch (type) {
    case 1:
      return { icon: 'headphones', label: 'Listening' };
    case 2:
      return { icon: 'microphone', label: 'Speaking' };
    case 3:
      return { icon: 'book-alphabet', label: 'Vocabulary' };
    case 4:
      return { icon: 'clipboard-text', label: 'Exercise' };
    default:
      return { icon: 'book-alphabet', label: 'Lesson' };
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return colors.primary;
  if (score >= 50) return colors.warning;
  return colors.error;
}

export default function HistoryScreen() {
  const { t } = useI18n();
  const locale = useSettingsStore((s) => s.locale);
  const { data: history, isLoading } = useHistory();

  const renderItem = ({ item }: { item: HistoryParagraphEntity }) => {
    const typeInfo = getTypeInfo(item.type);
    const title = item.paragraph?.title ?? item.title ?? `Lesson #${item.id}`;
    const timeAgo = item.created_at ? formatRelativeTime(String(item.created_at), locale) : '';
    const subtitle = `${typeInfo.label} · ${timeAgo}`;
    // Use a placeholder score based on type for display
    const score = Math.floor(Math.random() * 40) + 60;

    return (
      <Pressable
        style={styles.activityItem}
        onPress={() => router.push(`/lesson/${item.paragraph?.id ?? item.id}`)}
      >
        <View style={styles.activityIconCircle}>
          <MaterialCommunityIcons name={typeInfo.icon} size={18} color={colors.primary} />
        </View>
        <View style={styles.activityTextCol}>
          <Text style={styles.activityTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.activitySubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.activityScoreCol}>
          <Text style={[styles.activityScore, { color: getScoreColor(score) }]}>{score}%</Text>
          <Text style={styles.activityScoreLabel}>{t('history.score')}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('history.title')}</Text>
        <Pressable style={styles.bellButton}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={colors.onSurface} />
        </Pressable>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Weekly Stats Card */}
            <View style={styles.weeklyCard}>
              <View style={styles.weeklyTopRow}>
                <View style={styles.weeklyPill}>
                  <Text style={styles.weeklyPillText}>{t('history.thisWeek')}</Text>
                </View>
                <View style={styles.weeklyBadge}>
                  <Text style={styles.weeklyBadgeText}>+12% vs last week</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statCol}>
                  <View style={styles.statIconCircle}>
                    <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.statValue}>4.5h</Text>
                  <Text style={styles.statLabel}>Time Studied</Text>
                </View>
                <View style={styles.statCol}>
                  <View style={styles.statIconCircle}>
                    <MaterialCommunityIcons
                      name="book-open-variant"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Lessons Done</Text>
                </View>
                <View style={styles.statCol}>
                  <View style={styles.statIconCircle}>
                    <MaterialCommunityIcons
                      name="text-box-outline"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.statValue}>87</Text>
                  <Text style={styles.statLabel}>Words Learned</Text>
                </View>
              </View>
            </View>

            {/* Recent Activity Header */}
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>{t('history.recentActivity')}</Text>
              <View style={styles.allTypesPill}>
                <Text style={styles.allTypesText}>{t('history.allTypes')}</Text>
              </View>
            </View>

            {/* Date separator */}
            <Text style={styles.dateSeparator}>Today, Mar 5</Text>
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="history" size={48} color={colors.outline} />
              <Text style={styles.emptyText}>{t('common.noResults')}</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: colors.onSurface,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  // Weekly Stats Card
  weeklyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 16,
  },
  weeklyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  weeklyPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  weeklyPillText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  weeklyBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  weeklyBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  // Recent Activity
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
  },
  allTypesPill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  allTypesText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  dateSeparator: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 0,
  },
  // Activity Items
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextCol: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  activitySubtitle: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  activityScoreCol: {
    alignItems: 'center',
    marginLeft: 8,
  },
  activityScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  activityScoreLabel: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: colors.onSurfaceVariant,
    marginTop: 12,
    fontSize: 14,
  },
});
