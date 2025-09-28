import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
          color={isValid ? '#4CAF50' : '#F44336'}
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
              color={rule.isValid ? '#4CAF50' : '#F44336'}
            />
            <Text style={[
              styles.ruleText,
              rule.isValid ? styles.validRuleText : styles.invalidRuleText
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
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error,
        validationStatus === 'valid' && styles.valid,
        validationStatus === 'invalid' && styles.invalid,
      ]}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
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
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  focused: {
    borderColor: '#2196F3',
  },
  error: {
    borderColor: '#F44336',
  },
  valid: {
    borderColor: '#4CAF50',
  },
  invalid: {
    borderColor: '#F44336',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
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
    color: '#F44336',
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
  validRuleText: {
    color: '#4CAF50',
  },
  invalidRuleText: {
    color: '#F44336',
  },
});

export default Input;