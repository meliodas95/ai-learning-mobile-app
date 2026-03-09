import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
} from 'react-native';
import { Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/src/i18n';
import { colors } from '@/src/theme/colors';
import { useForgotPasswordMutation } from '@/src/features/auth/hooks/useAuth';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const forgotSchema = z.object({
  phone: z.string().regex(/(84|0[35789])\d{8}$/, 'Invalid phone number'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordScreen() {
  const { t } = useI18n();
  const forgotPassword = useForgotPasswordMutation();
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      await forgotPassword.mutateAsync({ phone: data.phone });
      setSuccess(true);
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
        <View style={styles.content}>
          {/* Back button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onSurface} />
          </Pressable>

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name={success ? 'check-circle' : 'lock-reset'}
                size={64}
                color={colors.primary}
              />
            </View>
            <Text style={styles.title}>{t('auth.forgotPasswordTitle')}</Text>
            <Text style={styles.subtitle}>
              {success ? t('auth.resetSent') : t('auth.forgotPasswordSubtitle')}
            </Text>
          </View>

          {!success ? (
            <View style={styles.form}>
              {/* Phone */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>{t('auth.phone')}</Text>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[styles.inputRow, errors.phone ? styles.inputRowError : undefined]}
                    >
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

              {/* API Error */}
              {forgotPassword.isError && (
                <HelperText type="error" style={styles.apiError}>
                  {t('auth.resetFailed')}
                </HelperText>
              )}

              {/* Submit Button */}
              <Pressable
                style={[
                  styles.primaryButton,
                  forgotPassword.isPending && styles.primaryButtonDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={forgotPassword.isPending}
              >
                <Text style={styles.primaryButtonText}>{t('auth.sendResetLink')}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.form}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.primaryButtonText}>{t('auth.backToSignIn')}</Text>
              </Pressable>
            </View>
          )}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
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
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
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
