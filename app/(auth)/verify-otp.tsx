import { useState, useEffect, useCallback } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/src/i18n';
import { colors } from '@/src/theme/colors';
import { useVerifyOtpMutation, useSendOtpMutation } from '@/src/features/auth/hooks/useAuth';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

export default function VerifyOtpScreen() {
  const { t } = useI18n();
  const { phone, fullname, deviceId } = useLocalSearchParams<{
    phone: string;
    fullname: string;
    deviceId: string;
  }>();

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const verifyOtp = useVerifyOtpMutation();
  const resendOtp = useSendOtpMutation();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (!phone || !deviceId || otp.length < OTP_LENGTH) return;
    try {
      const result = await verifyOtp.mutateAsync({
        phone,
        otp,
        deviceId,
      });
      router.push({
        pathname: '/(auth)/create-password',
        params: {
          phone,
          fullname: fullname ?? '',
          deviceId,
          otpToken: result.data?.token ?? '',
        },
      });
    } catch {
      // Error handled by mutation state
    }
  };

  const handleResend = useCallback(async () => {
    if (!phone || !deviceId || countdown > 0) return;
    try {
      await resendOtp.mutateAsync({ phone, deviceId });
      setCountdown(COUNTDOWN_SECONDS);
      setOtp('');
    } catch {
      // Silently fail resend
    }
  }, [phone, deviceId, countdown, resendOtp]);

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
              <MaterialCommunityIcons name="cellphone-message" size={64} color={colors.primary} />
            </View>
            <Typography size={28} weight="700" style={styles.title}>
              {t('auth.otpTitle')}
            </Typography>
            <Typography size={15} color={colors.onSurfaceVariant} style={styles.subtitle}>
              {t('auth.otpSentTo')} {phone}
            </Typography>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              textContentType="oneTimeCode"
              autoFocus
              placeholder="000000"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Error */}
          {verifyOtp.isError && (
            <HelperText type="error" style={styles.apiError}>
              {t('auth.verifyFailed')}
            </HelperText>
          )}

          {/* Verify Button */}
          <Pressable
            style={[
              styles.primaryButton,
              (verifyOtp.isPending || otp.length < OTP_LENGTH) && styles.primaryButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={verifyOtp.isPending || otp.length < OTP_LENGTH}
          >
            <Typography weight="600" color={colors.onPrimary}>
              {t('auth.verify')}
            </Typography>
          </Pressable>

          {/* Resend */}
          <View style={styles.resendRow}>
            {countdown > 0 ? (
              <Typography size={14} color={colors.textTertiary}>
                {t('auth.resendIn', { seconds: countdown })}
              </Typography>
            ) : (
              <Pressable onPress={handleResend} disabled={resendOtp.isPending}>
                <Typography size={14} weight="600" color={colors.primary}>
                  {t('auth.resendOtp')}
                </Typography>
              </Pressable>
            )}
          </View>
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
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 12,
    height: 56,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 12,
    textAlign: 'center',
    color: colors.onSurface,
    paddingHorizontal: 16,
  },
  apiError: {
    textAlign: 'center',
    paddingHorizontal: 0,
    marginBottom: 8,
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
  resendRow: {
    alignItems: 'center',
    marginTop: 20,
  },
});
