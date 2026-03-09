import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Typography } from '@/src/components/Typography';
import * as Haptics from 'expo-haptics';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TAB_ICONS: Record<string, string> = {
  index: 'home',
  courses: 'book-open-variant',
  history: 'history',
  profile: 'account',
};

export function PillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;
          const iconName = TAB_ICONS[route.name] ?? 'circle';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.activeTab]}
            >
              <MaterialCommunityIcons
                name={iconName as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                size={16}
                color={isFocused ? colors.onPrimary : colors.tabInactive}
              />
              <Typography
                size={9}
                weight={isFocused ? '600' : '500'}
                color={isFocused ? colors.onPrimary : colors.tabInactive}
                style={styles.label}
              >
                {String(label).toUpperCase()}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: colors.tabBarBg,
    borderRadius: 28,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    borderRadius: 24,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  label: {
    letterSpacing: 0.5,
  },
});
