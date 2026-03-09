import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Typography } from '@/src/components/Typography';
import { colors } from '@/src/theme/colors';
import { BORDER_RADIUS } from '@/src/constants';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Typography size={18} weight="600" color={colors.error} style={styles.title}>
            Something went wrong
          </Typography>
          <Typography size={14} color={colors.onSurfaceVariant} style={styles.error}>
            {this.state.error?.message}
          </Typography>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Typography weight="600" color={colors.onPrimary}>
              Try Again
            </Typography>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { marginBottom: 8 },
  error: { marginBottom: 24, textAlign: 'center' },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
  },
});
