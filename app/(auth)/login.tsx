import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '@/src/api/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const loginSchema = z.object({
  phone: z.string().regex(/(84|0[35789])\d{8}$/, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const theme = useTheme();
  const loginMutation = useLoginMutation();
  const setAuth = useAuthStore((s) => s.setAuth);

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
            Learning AI
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Learn English with AI
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Phone number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                mode="outlined"
                error={!!errors.phone}
                style={styles.input}
              />
            )}
          />
          {errors.phone && <HelperText type="error">{errors.phone.message}</HelperText>}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                mode="outlined"
                error={!!errors.password}
                style={styles.input}
              />
            )}
          />
          {errors.password && <HelperText type="error">{errors.password.message}</HelperText>}

          {loginMutation.isError && (
            <HelperText type="error" style={styles.apiError}>
              Login failed. Please check your credentials.
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  title: { fontWeight: '700', marginBottom: 8 },
  form: { gap: 4 },
  input: { marginBottom: 4 },
  apiError: { textAlign: 'center' },
  button: { marginTop: 16, borderRadius: 12 },
  buttonContent: { height: 48 },
});
