import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useInclusive';

const LoadingSpinner = ({ message = 'Loading...', size = 'large', color }) => {
  const { theme } = useTheme();
  const spinnerColor = color || theme.colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {message && <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingSpinner;