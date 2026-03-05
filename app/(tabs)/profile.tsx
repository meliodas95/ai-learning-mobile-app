import { useI18n } from '@/src/i18n';
import { useAuthStore } from '@/src/store/authStore';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SettingsItem {
  icon: IconName;
  title: string;
  desc: string;
}

export default function ProfileScreen() {
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const member = useAuthStore((s) => s.member);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const displayName = user?.fullname ?? member?.fullname ?? 'User';
  const displayContact = user?.phone ?? '';
  const initial = displayName.charAt(0).toUpperCase();

  const settingsItems: SettingsItem[] = [
    { icon: 'translate', title: t('profile.language'), desc: 'Vietnamese + English' },
    { icon: 'brightness-6', title: t('profile.appearance'), desc: t('profile.lightMode') },
    {
      icon: 'bell-outline',
      title: t('profile.notifications'),
      desc: t('profile.dailyReminders'),
    },
    { icon: 'volume-high', title: t('profile.audioSettings'), desc: t('profile.audioDesc') },
    {
      icon: 'help-circle-outline',
      title: t('profile.helpSupport'),
      desc: t('profile.helpDesc'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('tabs.profile')}</Text>
          <MaterialCommunityIcons name="cog-outline" size={22} color={colors.onSurfaceVariant} />
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          {displayContact ? <Text style={styles.userContact}>{displayContact}</Text> : null}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>{t('profile.dayStreak')}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>{t('profile.lessonsCount')}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statValue}>820</Text>
            <Text style={styles.statLabel}>{t('profile.wordsCount')}</Text>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.settingsMenu}>
          {settingsItems.map((item, index) => (
            <Pressable key={index} style={styles.settingsItem}>
              <View style={styles.settingsIconCircle}>
                <MaterialCommunityIcons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.settingsTextCol}>
                <Text style={styles.settingsTitle}>{item.title}</Text>
                <Text style={styles.settingsDesc}>{item.desc}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textTertiary} />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('auth.logout')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.onSurface,
  },
  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    marginTop: 16,
  },
  userContact: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  // Settings Menu
  settingsMenu: {
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  settingsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsTextCol: {
    flex: 1,
    marginLeft: 14,
    gap: 2,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  settingsDesc: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  // Logout
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
});
