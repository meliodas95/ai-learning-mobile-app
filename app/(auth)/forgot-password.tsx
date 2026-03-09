import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
} from 'react-native';
import { HelperText } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
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
            <Typography size={28} weight="700" style={styles.title}>
              {t('auth.forgotPasswordTitle')}
            </Typography>
            <Typography size={15} color={colors.onSurfaceVariant} style={styles.subtitle}>
              {success ? t('auth.resetSent') : t('auth.forgotPasswordSubtitle')}
            </Typography>
          </View>

          {!success ? (
            <View style={styles.form}>
              {/* Phone */}
              <View style={styles.fieldGroup}>
                <Typography size={14} weight="600" style={styles.label}>
                  {t('auth.phone')}
                </Typography>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[styles.inputRow, errors.phone ? styles.inputRowError : undefined]}
                    >
                      <Typography size={15} weight="500">
                        {t('auth.phonePrefix')}
                      </Typography>
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
                <Typography weight="600" color={colors.onPrimary}>
                  {t('auth.sendResetLink')}
                </Typography>
              </Pressable>
            </View>
          ) : (
            <View style={styles.form}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => router.replace('/(auth)/login')}
              >
                <Typography weight="600" color={colors.onPrimary}>
                  {t('auth.backToSignIn')}
                </Typography>
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
    letterSpacing: -0.5,
  },
  subtitle: {
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
});
