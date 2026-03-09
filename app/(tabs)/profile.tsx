import { SelectRow, SettingsBottomSheet, ToggleRow } from '@/src/components/SettingsBottomSheet';
import { useI18n } from '@/src/i18n';
import { useAuthStore } from '@/src/store/authStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type BottomSheet from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/src/components/Typography';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function ProfileScreen() {
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const member = useAuthStore((s) => s.member);
  const logout = useAuthStore((s) => s.logout);

  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);
  const autoPlay = useSettingsStore((s) => s.autoPlay);
  const setAutoPlay = useSettingsStore((s) => s.setAutoPlay);
  const showTranslation = useSettingsStore((s) => s.showTranslation);
  const setShowTranslation = useSettingsStore((s) => s.setShowTranslation);

  const languageSheetRef = useRef<BottomSheet>(null);
  const audioSheetRef = useRef<BottomSheet>(null);
  const notificationSheetRef = useRef<BottomSheet>(null);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const openSheet = useCallback((ref: React.RefObject<BottomSheet | null>) => {
    ref.current?.expand();
  }, []);

  const displayName = user?.fullname ?? member?.fullname ?? 'User';
  const displayContact = user?.phone ?? '';
  const initial = displayName.charAt(0).toUpperCase();

  const languageDesc = locale === 'vi' ? 'Vietnamese + English' : 'English + Vietnamese';

  const settingsItems: {
    icon: IconName;
    title: string;
    desc: string;
    onPress: () => void;
  }[] = [
    {
      icon: 'translate',
      title: t('profile.language'),
      desc: languageDesc,
      onPress: () => openSheet(languageSheetRef),
    },
    {
      icon: 'brightness-6',
      title: t('profile.appearance'),
      desc: t('profile.lightMode'),
      onPress: () => {},
    },
    {
      icon: 'bell-outline',
      title: t('profile.notifications'),
      desc: t('profile.dailyReminders'),
      onPress: () => openSheet(notificationSheetRef),
    },
    {
      icon: 'volume-high',
      title: t('profile.audioSettings'),
      desc: t('profile.audioDesc'),
      onPress: () => openSheet(audioSheetRef),
    },
    {
      icon: 'help-circle-outline',
      title: t('profile.helpSupport'),
      desc: t('profile.helpDesc'),
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Typography size={26} weight="600">
            {t('tabs.profile')}
          </Typography>
          <MaterialCommunityIcons name="cog-outline" size={22} color={colors.onSurfaceVariant} />
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Typography size={36} weight="700" color={colors.onPrimary}>
              {initial}
            </Typography>
          </View>
          <Typography size={20} weight="600" style={styles.userName}>
            {displayName}
          </Typography>
          {displayContact ? (
            <Typography size={14} color={colors.onSurfaceVariant} style={styles.userContact}>
              {displayContact}
            </Typography>
          ) : null}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Typography size={28} weight="700">
              42
            </Typography>
            <Typography size={12} color={colors.onSurfaceVariant}>
              {t('profile.dayStreak')}
            </Typography>
          </View>
          <View style={styles.statCol}>
            <Typography size={28} weight="700">
              156
            </Typography>
            <Typography size={12} color={colors.onSurfaceVariant}>
              {t('profile.lessonsCount')}
            </Typography>
          </View>
          <View style={styles.statCol}>
            <Typography size={28} weight="700">
              820
            </Typography>
            <Typography size={12} color={colors.onSurfaceVariant}>
              {t('profile.wordsCount')}
            </Typography>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.settingsMenu}>
          {settingsItems.map((item, index) => (
            <Pressable key={index} style={styles.settingsItem} onPress={item.onPress}>
              <View style={styles.settingsIconCircle}>
                <MaterialCommunityIcons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.settingsTextCol}>
                <Typography size={15} weight="600">
                  {item.title}
                </Typography>
                <Typography size={12} color={colors.onSurfaceVariant}>
                  {item.desc}
                </Typography>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textTertiary} />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Typography size={15} weight="600" color={colors.error}>
            {t('auth.logout')}
          </Typography>
        </Pressable>
      </ScrollView>

      {/* Language Bottom Sheet */}
      <SettingsBottomSheet ref={languageSheetRef} title={t('profile.languageTitle')}>
        <Typography size={14} color={colors.onSurfaceVariant} style={styles.sheetDesc}>
          {t('profile.languageDesc')}
        </Typography>
        <SelectRow
          icon={<Typography size={20}>🇻🇳</Typography>}
          title={t('profile.vietnamese')}
          selected={locale === 'vi'}
          onPress={() => {
            setLocale('vi');
            languageSheetRef.current?.close();
          }}
        />
        <SelectRow
          icon={<Typography size={20}>🇬🇧</Typography>}
          title={t('profile.english')}
          selected={locale === 'en'}
          onPress={() => {
            setLocale('en');
            languageSheetRef.current?.close();
          }}
        />
      </SettingsBottomSheet>

      {/* Audio Settings Bottom Sheet */}
      <SettingsBottomSheet ref={audioSheetRef} title={t('profile.audioTitle')}>
        <ToggleRow
          icon={<MaterialCommunityIcons name="play-circle" size={20} color={colors.primary} />}
          title={t('profile.autoPlayAudio')}
          description={t('profile.autoPlayAudioDesc')}
          value={autoPlay}
          onToggle={setAutoPlay}
        />
        <ToggleRow
          icon={<MaterialCommunityIcons name="translate" size={20} color={colors.primary} />}
          title={t('profile.showTranslationToggle')}
          description={t('profile.showTranslationDesc')}
          value={showTranslation}
          onToggle={setShowTranslation}
        />
      </SettingsBottomSheet>

      {/* Notifications Bottom Sheet */}
      <SettingsBottomSheet ref={notificationSheetRef} title={t('profile.notificationTitle')}>
        <ToggleRow
          icon={<MaterialCommunityIcons name="bell-ring" size={20} color={colors.primary} />}
          title={t('profile.dailyRemindersToggle')}
          description={t('profile.dailyRemindersDesc')}
          value={false}
          onToggle={() => {}}
        />
      </SettingsBottomSheet>
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
  userName: {
    marginTop: 16,
  },
  userContact: {
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
  // Bottom sheet extras
  sheetDesc: {
    textAlign: 'center',
    marginBottom: 4,
  },
});
