// Email validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  return {
    isValid,
    rules: [
      {
        text: 'Contains @ symbol',
        isValid: email.includes('@'),
      },
      {
        text: 'Valid email format',
        isValid: emailRegex.test(email),
      },
      {
        text: 'Not empty',
        isValid: email.trim().length > 0,
      },
    ],
  };
};

// Password validation utilities
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = minLength && hasUppercase && hasLowercase && hasNumber;
  
  return {
    isValid,
    rules: [
      {
        text: 'At least 8 characters',
        isValid: minLength,
      },
      {
        text: 'Contains uppercase letter',
        isValid: hasUppercase,
      },
      {
        text: 'Contains lowercase letter',
        isValid: hasLowercase,
      },
      {
        text: 'Contains number',
        isValid: hasNumber,
      },
      {
        text: 'Contains special character (recommended)',
        isValid: hasSpecialChar,
      },
    ],
  };
};

// Password confirmation validation
export const validatePasswordConfirmation = (password, confirmPassword) => {
  const matches = password === confirmPassword;
  const isNotEmpty = confirmPassword.trim().length > 0;
  
  return {
    isValid: matches && isNotEmpty,
    rules: [
      {
        text: 'Not empty',
        isValid: isNotEmpty,
      },
      {
        text: 'Matches password',
        isValid: matches,
      },
    ],
  };
};

// Name validation
export const validateName = (name) => {
  const trimmedName = name.trim();
  const minLength = trimmedName.length >= 2;
  const hasValidChars = /^[a-zA-Z\s'-]+$/.test(trimmedName);
  const hasMultipleWords = trimmedName.split(' ').filter(word => word.length > 0).length >= 2;
  
  const isValid = minLength && hasValidChars;
  
  return {
    isValid,
    rules: [
      {
        text: 'At least 2 characters',
        isValid: minLength,
      },
      {
        text: 'Valid name characters only',
        isValid: hasValidChars,
      },
      {
        text: 'Full name recommended',
        isValid: hasMultipleWords,
      },
    ],
  };
};

// Get overall validation status
export const getValidationStatus = (validationResult) => {
  if (!validationResult) return null;
  return validationResult.isValid ? 'valid' : 'invalid';
};

// Check if all validations are valid
export const areAllValidationsValid = (...validations) => {
  return validations.every(validation => validation && validation.isValid);
};