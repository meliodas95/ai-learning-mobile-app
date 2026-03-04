import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useHistory } from '@/src/api/hooks/useHistory';
import { useSettingsStore } from '@/src/store/settingsStore';
import { formatRelativeTime } from '@/src/utils/formatters';
import { getScoreHex } from '@/src/utils/score';
import type { HistoryItem } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HistoryScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const locale = useSettingsStore((s) => s.locale);
  const { data: history, isLoading } = useHistory();

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() => router.push(`/lesson/${item.paragraph_id}`)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
            {item.paragraph_title ?? `Lesson #${item.paragraph_id}`}
          </Text>
          {item.course_title && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
              {item.course_title}
            </Text>
          )}
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {formatRelativeTime(item.created_at, locale)}
          </Text>
        </View>
        {item.score != null && (
          <View style={styles.scoreContainer}>
            <Text variant="titleMedium" style={{ color: getScoreHex(item.score), fontWeight: '700' }}>
              {item.score}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          {t('tabs.history')}
        </Text>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="history" size={48} color={theme.colors.outline} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
                {t('common.noResults')}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: { marginBottom: 8, borderRadius: 12 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  scoreContainer: { marginLeft: 12, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
