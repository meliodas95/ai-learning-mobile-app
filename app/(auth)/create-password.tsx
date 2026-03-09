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
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/src/i18n';
import { colors } from '@/src/theme/colors';
import { useSavePasswordMutation } from '@/src/features/auth/hooks/useAuth';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const passwordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function CreatePasswordScreen() {
  const { t } = useI18n();
  const { fullname, deviceId, otpToken } = useLocalSearchParams<{
    phone: string;
    fullname: string;
    deviceId: string;
    otpToken: string;
  }>();

  const savePassword = useSavePasswordMutation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: PasswordForm) => {
    if (!otpToken || !deviceId) return;
    try {
      await savePassword.mutateAsync({
        token: otpToken,
        deviceId,
        fullname: fullname ?? '',
        password: data.password,
      });
      // Navigate to login after successful registration
      router.replace('/(auth)/login');
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
          {/* Back button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onSurface} />
          </Pressable>

          {/* Hero Area */}
          <View style={styles.hero}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="lock-plus" size={64} color={colors.primary} />
            </View>
            <Text style={styles.title}>{t('auth.createPasswordTitle')}</Text>
            <Text style={styles.subtitle}>{t('auth.createPasswordSubtitle')}</Text>
          </View>

          {/* Form Area */}
          <View style={styles.form}>
            {/* Password */}
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

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('auth.confirmPassword')}</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputRow,
                      errors.confirmPassword ? styles.inputRowError : undefined,
                    ]}
                  >
                    <TextInput
                      style={[styles.textInput, styles.passwordInput]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={secureEntryConfirm}
                      placeholderTextColor={colors.textTertiary}
                    />
                    <Pressable
                      onPress={() => setSecureEntryConfirm(!secureEntryConfirm)}
                      hitSlop={8}
                      style={styles.eyeButton}
                    >
                      <MaterialCommunityIcons
                        name={secureEntryConfirm ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.textTertiary}
                      />
                    </Pressable>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <HelperText type="error" style={styles.helperText}>
                  {errors.confirmPassword.message}
                </HelperText>
              )}
            </View>

            {/* API Error */}
            {savePassword.isError && (
              <HelperText type="error" style={styles.apiError}>
                {t('auth.createAccountFailed')}
              </HelperText>
            )}

            {/* Create Account Button */}
            <Pressable
              style={[styles.primaryButton, savePassword.isPending && styles.primaryButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={savePassword.isPending}
            >
              <Text style={styles.primaryButtonText}>{t('auth.createAccount')}</Text>
            </Pressable>
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  hero: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.onSurface,
  },
  subtitle: {
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  form: {
    paddingHorizontal: 24,
    gap: 20,
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
  apiError: {
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
});
