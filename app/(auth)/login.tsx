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
import { Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '@/src/api/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/src/i18n';
import { colors } from '@/src/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const loginSchema = z.object({
  phone: z.string().regex(/(84|0[35789])\d{8}$/, 'Invalid phone number'),
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
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="translate" size={80} color={colors.primary} />
            </View>
            <Text style={styles.appName}>{t('auth.appTitle')}</Text>
            <Text style={styles.tagline}>{t('auth.appSubtitle')}</Text>
          </View>

          {/* Form Area */}
          <View style={styles.form}>
            {/* Phone Section */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('auth.phone')}</Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputRow, errors.phone ? styles.inputRowError : undefined]}>
                    <Text style={styles.prefix}>{t('auth.phonePrefix')}</Text>
                    <View style={styles.divider} />
                    <TextInput
                      style={styles.textInput}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
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
              <Text style={styles.label}>{t('auth.password')}</Text>
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
            <Pressable style={styles.forgotRow}>
              <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
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
              <Text style={styles.signInText}>{t('auth.signIn')}</Text>
            </Pressable>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.noAccountText}>{t('auth.noAccount')}</Text>
              <Pressable>
                <Text style={styles.registerLink}>{t('auth.register')}</Text>
              </Pressable>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>{t('auth.termsNotice')}</Text>
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
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    color: colors.onSurface,
  },
  tagline: {
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  form: {
    paddingHorizontal: 24,
    gap: 24,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
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
  prefix: {
    fontWeight: '500',
    fontSize: 15,
    color: colors.onSurface,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.outline,
    marginHorizontal: 12,
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
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
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
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  noAccountText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  termsText: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
