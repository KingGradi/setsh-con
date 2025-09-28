import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useInclusive';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
  validationStatus, // 'valid', 'invalid', or null/undefined for no validation
  validationRules = [], // Array of validation rules to display
  showValidationIndicator = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderValidationIndicator = () => {
    if (!showValidationIndicator || !validationStatus) return null;

    const isValid = validationStatus === 'valid';
    return (
      <View style={styles.validationIndicator}>
        <Ionicons
          name={isValid ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={isValid ? theme.colors.success : theme.colors.error}
        />
      </View>
    );
  };

  const renderValidationRules = () => {
    if (!validationRules || validationRules.length === 0) return null;

    return (
      <View style={styles.validationRules}>
        {validationRules.map((rule, index) => (
          <View key={index} style={styles.validationRule}>
            <Ionicons
              name={rule.isValid ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={rule.isValid ? theme.colors.success : theme.colors.error}
            />
            <Text style={[
              styles.ruleText,
              { color: rule.isValid ? theme.colors.success : theme.colors.error }
            ]}>
              {rule.text}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        { 
          borderColor: theme.colors.inputBorder, 
          backgroundColor: theme.colors.inputBackground 
        },
        isFocused && { borderColor: theme.colors.inputBorderFocused },
        error && { borderColor: theme.colors.error },
        validationStatus === 'valid' && { borderColor: theme.colors.success },
        validationStatus === 'invalid' && { borderColor: theme.colors.error },
      ]}>
        <TextInput
          style={[
            styles.input, 
            inputStyle, 
            { 
              color: theme.colors.inputText,
            }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.inputPlaceholder}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <View style={styles.rightIcons}>
          {renderValidationIndicator()}
          {secureTextEntry && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
      {renderValidationRules()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validationIndicator: {
    paddingRight: 8,
  },
  eyeIcon: {
    padding: 12,
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
  },
  validationRules: {
    marginTop: 8,
    paddingLeft: 4,
  },
  validationRule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ruleText: {
    marginLeft: 8,
    fontSize: 13,
    flex: 1,
  },
});

export default Input;