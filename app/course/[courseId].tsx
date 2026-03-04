import { useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDocuments } from '@/src/api/hooks/useCourses';
import type { DocumentEntity } from '@/src/api/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CourseDetailScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: documents, isLoading } = useDocuments(courseId ? Number(courseId) : undefined);

  const renderDocument = useCallback(
    ({ item }: { item: DocumentEntity }) => (
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        onPress={() => router.push(`/document/${item.id}`)}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={24}
            color={theme.colors.primary}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
              {item.title}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
            >
              {item.paragraphs?.length ?? 0} {t('courses.paragraphs').toLowerCase()}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={theme.colors.onSurfaceVariant}
          />
        </Card.Content>
      </Card>
    ),
    [theme, t],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          {t('courses.documents')}
        </Text>
      </View>
      <FlatList
        data={documents}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderDocument}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: 16, gap: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: { marginBottom: 8, borderRadius: 12 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
