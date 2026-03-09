import { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useAuthStore } from '@/src/store/authStore';
import { useNews } from '@/src/features/home/hooks/useNews';
import { useHomeStats, useWeeklyLearns } from '@/src/features/home/hooks/useHomeStats';
import { StatsGrid } from '@/src/features/home/components/StatsGrid';
import { WeeklyChart } from '@/src/features/home/components/WeeklyChart';
import { NewsFeedItem } from '@/src/features/home/components/NewsFeedItem';
import { colors } from '@/src/theme/colors';
import { Typography } from '@/src/components/Typography';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NewsItem } from '@/src/api/types';

export default function HomeScreen() {
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const member = useAuthStore((s) => s.member);
  const { data: stats } = useHomeStats();
  const { data: weeklyData } = useWeeklyLearns();
  const {
    data: newsPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useNews();

  const newsItems = useMemo(
    () => newsPages?.pages.flatMap((p) => p?.news ?? []) ?? [],
    [newsPages],
  );

  const displayName = user?.fullname ?? member?.fullname ?? '';
  const initial = displayName.charAt(0).toUpperCase() || '?';

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => <NewsFeedItem item={item} />,
    [],
  );

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerContent}>
        {/* Greeting Header */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeft}>
            <View style={styles.avatar}>
              <Typography size={20} weight="700" color={colors.primary}>
                {initial}
              </Typography>
            </View>
            <View style={styles.greetingTextCol}>
              <Typography size={12} color={colors.onSurfaceVariant}>
                {t('home.goodMorning')}
              </Typography>
              <Typography size={20} weight="600">
                {displayName}
              </Typography>
            </View>
          </View>
          <Pressable style={styles.bellButton}>
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.onSurface} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <Pressable style={styles.searchBar} onPress={() => router.push('/search')}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textTertiary} />
          <Typography size={15} color={colors.textTertiary}>
            {t('home.searchPlaceholder')}
          </Typography>
        </Pressable>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />

        {/* News Feed Title */}
        <Typography size={18} weight="600" style={styles.sectionTitle}>
          {t('home.newsFeed')}
        </Typography>
      </View>
    ),
    [initial, displayName, t, stats, weeklyData],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={newsItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderNewsItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.loader} color={colors.primary} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={48}
              color={colors.outline}
            />
            <Typography size={14} color={colors.onSurfaceVariant}>
              {t('common.noResults')}
            </Typography>
          </View>
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerContent: {
    gap: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  // Greeting
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingTextCol: {
    gap: 2,
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
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: 16,
    gap: 12,
  },
  // Section
  sectionTitle: {
    letterSpacing: -0.2,
    marginTop: 4,
  },
  // Footer
  loader: {
    paddingVertical: 20,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
});
