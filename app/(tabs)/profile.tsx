import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Switch, Button, Divider, useTheme, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/src/theme/colors';
import { useAuthStore } from '@/src/store/authStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import i18n from '@/src/i18n';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ProfileScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const member = useAuthStore((s) => s.member);
  const logout = useAuthStore((s) => s.logout);
  const { locale, showTranslation, autoPlay, setLocale, setShowTranslation, setAutoPlay } =
    useSettingsStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const toggleLocale = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={[styles.header, { color: theme.colors.primary }]}>
          {t('tabs.profile')}
        </Text>

        {/* User Info Card */}
        <Surface style={[styles.userCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-circle" size={56} color={theme.colors.primary} />
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            {user?.fullname ?? member?.fullname ?? 'User'}
          </Text>
          {user?.phone && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {user.phone}
            </Text>
          )}
        </Surface>

        {/* Token Balance */}
        {member && (
          <Surface
            style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}
            elevation={2}
          >
            <MaterialCommunityIcons name="star-circle" size={28} color="#FFF" />
            <View style={{ marginLeft: 12 }}>
              <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('profile.tokenBalance')}
              </Text>
              <Text variant="titleLarge" style={{ color: '#FFF', fontWeight: '700' }}>
                {t('profile.tokens', { count: member.token })}
              </Text>
            </View>
          </Surface>
        )}

        {/* Settings */}
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          {t('profile.settings')}
        </Text>
        <Surface
          style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <List.Item
            title={t('profile.language')}
            description={locale === 'vi' ? 'Tiếng Việt' : 'English'}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={() => (
              <Button mode="text" compact onPress={toggleLocale}>
                {locale === 'vi' ? 'EN' : 'VI'}
              </Button>
            )}
          />
          <Divider />
          <List.Item
            title={t('profile.showTranslation')}
            left={(props) => <List.Icon {...props} icon="subtitles" />}
            right={() => <Switch value={showTranslation} onValueChange={setShowTranslation} />}
          />
          <Divider />
          <List.Item
            title={t('profile.autoPlay')}
            left={(props) => <List.Icon {...props} icon="play-circle" />}
            right={() => <Switch value={autoPlay} onValueChange={setAutoPlay} />}
          />
        </Surface>

        {/* Logout */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          {t('auth.logout')}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: { fontWeight: '700', marginBottom: 16 },
  userCard: { borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 16 },
  avatar: { marginBottom: 8 },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
  settingsCard: { borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  logoutButton: { borderRadius: 12, borderColor: colors.error },
});
