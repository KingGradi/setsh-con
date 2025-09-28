import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/common/Input';
import AddressInput from '../../components/common/AddressInput';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
  getValidationStatus,
  areAllValidationsValid,
} from '../../utils/validationUtils';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    homeAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  // Live validation using useMemo for performance
  const nameValidation = useMemo(() => validateName(formData.name), [formData.name]);
  const emailValidation = useMemo(() => validateEmail(formData.email), [formData.email]);
  const passwordValidation = useMemo(() => validatePassword(formData.password), [formData.password]);
  const confirmPasswordValidation = useMemo(
    () => validatePasswordConfirmation(formData.password, formData.confirmPassword),
    [formData.password, formData.confirmPassword]
  );

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    return areAllValidationsValid(
      nameValidation,
      emailValidation,
      passwordValidation,
      confirmPasswordValidation
    );
  }, [nameValidation, emailValidation, passwordValidation, confirmPasswordValidation]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Use live validation results instead of basic checks
    if (!nameValidation.isValid) {
      Alert.alert('Invalid Name', 'Please enter a valid full name');
      return false;
    }

    if (!emailValidation.isValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    if (!passwordValidation.isValid) {
      Alert.alert('Weak Password', 'Please ensure your password meets all requirements');
      return false;
    }

    if (!confirmPasswordValidation.isValid) {
      Alert.alert('Password Mismatch', 'Please ensure passwords match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'citizen',
        home_address: formData.homeAddress.trim() || undefined,
      };

      await signUp(userData);
      Alert.alert(
        'Success',
        'Account created successfully! Please sign in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const handleTermsPress = () => {
    navigation.navigate('TermsOfService');
  };

  const handlePrivacyPress = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Join Setshaba Connect</Text>
            <Text style={styles.subtitle}>
              Create an account to start reporting community issues
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Enter your full name"
              validationStatus={formData.name ? getValidationStatus(nameValidation) : null}
              validationRules={formData.name ? nameValidation.rules : []}
              showValidationIndicator={formData.name.length > 0}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              validationStatus={formData.email ? getValidationStatus(emailValidation) : null}
              validationRules={formData.email ? emailValidation.rules : []}
              showValidationIndicator={formData.email.length > 0}
            />

            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              placeholder="Create a strong password"
              secureTextEntry
              validationStatus={formData.password ? getValidationStatus(passwordValidation) : null}
              validationRules={formData.password ? passwordValidation.rules : []}
              showValidationIndicator={formData.password.length > 0}
            />

            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              placeholder="Confirm your password"
              secureTextEntry
              validationStatus={formData.confirmPassword ? getValidationStatus(confirmPasswordValidation) : null}
              validationRules={formData.confirmPassword ? confirmPasswordValidation.rules : []}
              showValidationIndicator={formData.confirmPassword.length > 0}
            />

            <AddressInput
              label="Home Address (Optional)"
              value={formData.homeAddress}
              onChangeText={(value) => updateFormData('homeAddress', value)}
              placeholder="Enter your home address or use GPS"
              style={styles.addressInput}
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              disabled={!isFormValid || loading}
              style={[
                styles.signupButton,
                !isFormValid && styles.disabledButton
              ]}
            />

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>By creating an account, you agree to our </Text>
              <TouchableOpacity onPress={handleTermsPress}>
                <Text style={styles.linkText}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}> and </Text>
              <TouchableOpacity onPress={handlePrivacyPress}>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Already have an account? Sign In"
              onPress={navigateToLogin}
              variant="secondary"
              style={styles.loginButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  linkText: {
    fontSize: 12,
    color: '#2196F3',
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addressInput: {
    marginBottom: 24,
  },
});

export default SignupScreen;