import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useInclusive';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry, 
  retryText = 'Try Again' 
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} 
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: theme.colors.textInverse }]}>{retryText}</Text>
        </TouchableOpacity>
      )}
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
    marginTop: 16,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorMessage;