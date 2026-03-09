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
import { HelperText } from 'react-native-paper';
import { Typography } from '@/src/components/Typography';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/src/i18n';
import { colors } from '@/src/theme/colors';
import { useSendOtpMutation } from '@/src/features/auth/hooks/useAuth';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const registerSchema = z.object({
  fullname: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/(84|0[35789])\d{8}$/, 'Invalid phone number'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { t } = useI18n();
  const sendOtp = useSendOtpMutation();
  const [deviceId] = useState(() => `mobile_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullname: '', phone: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const result = await sendOtp.mutateAsync({
        phone: data.phone,
        deviceId,
      });
      router.push({
        pathname: '/(auth)/verify-otp',
        params: {
          phone: data.phone,
          fullname: data.fullname,
          deviceId: result.data?.device_id ?? deviceId,
        },
      });
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
              <MaterialCommunityIcons name="account-plus" size={80} color={colors.primary} />
            </View>
            <Typography size={28} weight="700" style={styles.title}>
              {t('auth.registerTitle')}
            </Typography>
            <Typography size={15} color={colors.onSurfaceVariant}>
              {t('auth.registerSubtitle')}
            </Typography>
          </View>

          {/* Form Area */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Typography size={14} weight="600" style={styles.label}>
                {t('auth.fullName')}
              </Typography>
              <Controller
                control={control}
                name="fullname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[styles.inputRow, errors.fullname ? styles.inputRowError : undefined]}
                  >
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={20}
                      color={colors.textTertiary}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t('auth.fullName')}
                      placeholderTextColor={colors.textTertiary}
                      autoCapitalize="words"
                    />
                  </View>
                )}
              />
              {errors.fullname && (
                <HelperText type="error" style={styles.helperText}>
                  {errors.fullname.message}
                </HelperText>
              )}
            </View>

            {/* Phone */}
            <View style={styles.fieldGroup}>
              <Typography size={14} weight="600" style={styles.label}>
                {t('auth.phone')}
              </Typography>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputRow, errors.phone ? styles.inputRowError : undefined]}>
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
            {sendOtp.isError && (
              <HelperText type="error" style={styles.apiError}>
                {t('auth.registerFailed')}
              </HelperText>
            )}

            {/* Send OTP Button */}
            <Pressable
              style={[styles.primaryButton, sendOtp.isPending && styles.primaryButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={sendOtp.isPending}
            >
              <Typography weight="600" color={colors.onPrimary}>
                {t('auth.sendOtp')}
              </Typography>
            </Pressable>

            {/* Footer */}
            <View style={styles.footer}>
              <Typography size={14} color={colors.onSurfaceVariant}>
                {t('auth.haveAccount')}
              </Typography>
              <Pressable onPress={() => router.back()}>
                <Typography size={14} weight="600" color={colors.primary}>
                  {t('auth.signIn')}
                </Typography>
              </Pressable>
            </View>
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
    gap: 12,
    marginBottom: 40,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: -0.5,
  },
  form: {
    paddingHorizontal: 24,
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
    gap: 12,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.outline,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});
