import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '@/src/components/Typography';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface LessonItemProps {
  number: number;
  title: string;
  meta?: string;
  type?: string;
  onPress?: () => void;
}

export function LessonItem({ number, title, meta, type, onPress }: LessonItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.numberCircle}>
        <Typography weight="700" color={colors.primary}>
          {String(number).padStart(2, '0')}
        </Typography>
      </View>
      <View style={styles.info}>
        <Typography size={15} weight="600" color={colors.onSurface} numberOfLines={1}>
          {title}
        </Typography>
        {meta && (
          <Typography size={12} color={colors.onSurfaceVariant}>
            {meta}
          </Typography>
        )}
        {type && (
          <View style={styles.typeBadge}>
            <MaterialCommunityIcons name="image" size={10} color={colors.primary} />
            <Typography size={10} weight="600" color={colors.primary}>
              {type}
            </Typography>
          </View>
        )}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  numberCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
