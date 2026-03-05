import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useI18n } from '@/src/i18n';
import { useHistory } from '@/src/api/hooks/useHistory';
import { useSettingsStore } from '@/src/store/settingsStore';
import { formatRelativeTime } from '@/src/utils/formatters';
import type { HistoryParagraphEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HistoryScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const locale = useSettingsStore((s) => s.locale);
  const { data: history, isLoading } = useHistory();

  const renderItem = ({ item }: { item: HistoryParagraphEntity }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() => router.push(`/lesson/${item.paragraph?.id ?? item.id}`)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
            {item.paragraph?.title ?? item.title ?? `Lesson #${item.id}`}
          </Text>
          {item.course?.title && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
            >
              {item.course.title}
            </Text>
          )}
          {item.created_at && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              {formatRelativeTime(String(item.created_at), locale)}
            </Text>
          )}
        </View>
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
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}
              >
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
