import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
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

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.5 };
const PADDING = 3;

export function PillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [pillWidth, setPillWidth] = useState(0);
  const tabCount = state.routes.length;
  const tabWidth = pillWidth > 0 ? (pillWidth - PADDING * 2) / tabCount : 0;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setPillWidth(e.nativeEvent.layout.width);
  }, []);

  const indicatorStyle = useAnimatedStyle(() => {
    if (tabWidth <= 0) return { opacity: 0 };
    const translateX = PADDING + state.index * tabWidth;
    return {
      opacity: 1,
      width: tabWidth,
      transform: [{ translateX: withSpring(translateX, SPRING_CONFIG) }],
    };
  }, [state.index, tabWidth]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.pill} onLayout={onLayout}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />
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
            <Pressable key={route.key} onPress={onPress} style={styles.tab}>
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
    padding: PADDING,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  indicator: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    borderRadius: 24,
  },
  label: {
    letterSpacing: 0.5,
  },
});
