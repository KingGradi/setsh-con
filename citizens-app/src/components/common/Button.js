import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useInclusive';

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const variantStyle = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
    };

    const sizeStyle = {
      small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
      },
      medium: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
      },
      large: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
      },
    };

    return [
      baseStyle,
      variantStyle[variant],
      sizeStyle[size],
      (disabled || loading) && { opacity: 0.6 },
      style,
    ];
  };

  const getTextStyle = () => {
    const textColors = {
      primary: theme.colors.textInverse,
      secondary: theme.colors.primary,
      outline: theme.colors.text,
    };

    const textSizes = {
      small: 14,
      medium: 16,
      large: 18,
    };

    return [
      {
        fontWeight: '600',
        color: textColors[variant],
        fontSize: textSizes[size],
      },
      textStyle,
    ];
  };

  const getActivityIndicatorColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.textInverse;
      case 'secondary':
        return theme.colors.primary;
      case 'outline':
        return theme.colors.text;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getActivityIndicatorColor()} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;