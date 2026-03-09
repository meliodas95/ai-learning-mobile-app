import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { HelperText } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { useLoginMutation } from '@/src/features/auth/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/src/i18n';
import { colors } from '@/src/theme/colors';
import { images } from '@/assets';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const loginSchema = z.object({
  phone: z.string().regex(/^0[35789]\d{8}$/, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { t } = useI18n();
  const loginMutation = useLoginMutation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [secureEntry, setSecureEntry] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      await setAuth(result.data);
      // AuthGuard handles navigation after auth state change
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Area */}
          <View style={styles.hero}>
            <Image source={images.logo} style={styles.logo} contentFit="contain" />
            <Typography size={32} weight="700" style={styles.appName}>
              {t('auth.appTitle')}
            </Typography>
            <Typography size={15} color={colors.onSurfaceVariant}>
              {t('auth.appSubtitle')}
            </Typography>
          </View>

          {/* Form Area */}
          <View style={styles.form}>
            {/* Phone Section */}
            <View style={styles.fieldGroup}>
              <Typography size={14} weight="600" style={styles.label}>
                {t('auth.phone')}
              </Typography>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputRow, errors.phone ? styles.inputRowError : undefined]}>
                    <MaterialCommunityIcons
                      name="phone-outline"
                      size={20}
                      color={colors.onSurfaceVariant}
                    />
                    <TextInput
                      style={[styles.textInput, styles.phoneInput]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="0912 345 678"
                      keyboardType="phone-pad"
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>
                )}
              />
              {errors.phone && (
                <HelperText type="error" style={styles.helperText}>
                  {errors.phone.message}
                </HelperText>
              )}
            </View>

            {/* Password Section */}
            <View style={styles.fieldGroup}>
              <Typography size={14} weight="600" style={styles.label}>
                {t('auth.password')}
              </Typography>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[styles.inputRow, errors.password ? styles.inputRowError : undefined]}
                  >
                    <TextInput
                      style={[styles.textInput, styles.passwordInput]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={secureEntry}
                      placeholderTextColor={colors.textTertiary}
                    />
                    <Pressable
                      onPress={() => setSecureEntry(!secureEntry)}
                      hitSlop={8}
                      style={styles.eyeButton}
                    >
                      <MaterialCommunityIcons
                        name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.textTertiary}
                      />
                    </Pressable>
                  </View>
                )}
              />
              {errors.password && (
                <HelperText type="error" style={styles.helperText}>
                  {errors.password.message}
                </HelperText>
              )}
            </View>

            {/* Forgot Password */}
            <Pressable
              style={styles.forgotRow}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Typography size={13} weight="600" color={colors.primary}>
                {t('auth.forgotPassword')}
              </Typography>
            </Pressable>

            {/* API Error */}
            {loginMutation.isError && (
              <HelperText type="error" style={styles.apiError}>
                {t('auth.loginFailed')}
              </HelperText>
            )}

            {/* Sign In Button */}
            <Pressable
              style={[styles.signInButton, loginMutation.isPending && styles.signInButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loginMutation.isPending}
            >
              <Typography weight="600" color={colors.onPrimary}>
                {t('auth.signIn')}
              </Typography>
            </Pressable>

            {/* Footer */}
            <View style={styles.footer}>
              <Typography size={14} color={colors.onSurfaceVariant}>
                {t('auth.noAccount')}
              </Typography>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Typography size={14} weight="600" color={colors.primary}>
                  {t('auth.register')}
                </Typography>
              </Pressable>
            </View>

            {/* Terms */}
            <Typography size={11} color={colors.textTertiary} style={styles.termsText}>
              {t('auth.termsNotice')}
            </Typography>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 32,
  },
  hero: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  appName: {
    letterSpacing: -1,
  },
  form: {
    paddingHorizontal: 24,
    gap: 24,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  phoneInput: {
    marginLeft: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.onSurface,
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeButton: {
    padding: 4,
  },
  helperText: {
    paddingHorizontal: 0,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -16,
  },
  apiError: {
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  signInButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  termsText: {
    textAlign: 'center',
    lineHeight: 16,
  },
});
