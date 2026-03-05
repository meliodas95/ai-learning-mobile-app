import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface CourseCardProps {
  title: string;
  subtitle?: string;
  progress?: number;
  type?: string;
  onPress?: () => void;
}

export function CourseCard({ title, subtitle, progress, type, onPress }: CourseCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageArea}>
        <MaterialCommunityIcons name="image-outline" size={32} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {type && (
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name={type === 'video' ? 'video' : 'image'}
              size={12}
              color={colors.primary}
            />
            <Text style={styles.badgeText}>{type}</Text>
          </View>
        )}
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% complete</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    overflow: 'hidden',
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  imageArea: {
    height: 140,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, gap: 8 },
  title: { fontSize: 18, fontWeight: '600', color: colors.onSurface },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  subtitle: { fontSize: 13, color: colors.onSurfaceVariant },
  progressContainer: { gap: 6 },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 100 },
  progressText: { fontSize: 12, fontWeight: '500', color: colors.primary },
});
