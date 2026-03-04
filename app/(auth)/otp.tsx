import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemberLoginMutation } from '@/src/api/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OtpScreen() {
  const theme = useTheme();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const memberLogin = useMemberLoginMutation();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!token || otp.length < 4) return;
    try {
      const result = await memberLogin.mutateAsync({ token, password: otp });
      await setAuth(result);
      router.replace('/(tabs)');
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
          Enter OTP
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 32 }}>
          Enter the verification code sent to your device
        </Text>

        <TextInput
          label="OTP Code"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          mode="outlined"
          style={styles.input}
        />

        {memberLogin.isError && (
          <HelperText type="error">Invalid OTP. Please try again.</HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleVerify}
          loading={memberLogin.isPending}
          disabled={memberLogin.isPending || otp.length < 4}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Verify
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Back to Login
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  input: { marginBottom: 8 },
  button: { marginTop: 16, borderRadius: 12 },
  buttonContent: { height: 48 },
  backButton: { marginTop: 12 },
});
