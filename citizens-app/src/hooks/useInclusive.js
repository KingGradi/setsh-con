import { useState, useEffect, useContext, createContext } from 'react';
import translationService from '../services/translationService';
import accessibilityService from '../services/accessibilityService';
import themeService from '../services/themeService';

// Create contexts
const TranslationContext = createContext();
const AccessibilityContext = createContext();
const ThemeContext = createContext();

// Hook for translations
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    // Fallback if context is not available
    return {
      t: (key, params) => translationService.t(key, params),
      currentLanguage: translationService.getCurrentLanguage(),
      supportedLanguages: translationService.getSupportedLanguages(),
      setLanguage: translationService.setLanguage.bind(translationService),
    };
  }
  return context;
};

// Hook for accessibility
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    // Initialize accessibility service if not already done
    if (!accessibilityService.initialized) {
      accessibilityService.init();
    }
    
    // Fallback if context is not available
    return {
      isScreenReaderEnabled: accessibilityService.isScreenReaderEnabled(),
      isHighContrast: accessibilityService.isHighContrastEnabled(),
      fontSize: accessibilityService.getFontSize(),
      reducedMotion: accessibilityService.isReducedMotionEnabled(),
      getAccessibleStyles: accessibilityService.getAccessibleStyles.bind(accessibilityService),
      generateAccessibleLabel: accessibilityService.generateAccessibleLabel?.bind(accessibilityService) || (() => ''),
      announceForAccessibility: accessibilityService.announceForScreenReader.bind(accessibilityService),
    };
  }
  return context;
};

// Hook for theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if context is not available
    return {
      theme: themeService.getTheme(),
      isDarkMode: themeService.isDarkMode(),
      currentTheme: themeService.getCurrentTheme(),
      setTheme: themeService.setTheme.bind(themeService),
      isAutoMode: themeService.isAutoMode(),
      setAutoMode: themeService.setAutoMode.bind(themeService),
      getCategoryColor: themeService.getCategoryColor.bind(themeService),
      getStatusBarStyle: themeService.getStatusBarStyle.bind(themeService),
    };
  }
  return context;
};

// Combined accessibility hook that provides all inclusive features
export const useInclusive = () => {
  const translation = useTranslation();
  const accessibility = useAccessibility();
  const theme = useTheme();

  return {
    // Translation functions
    t: translation.t,
    currentLanguage: translation.currentLanguage,
    supportedLanguages: translation.supportedLanguages,
    setLanguage: translation.setLanguage,
    
    // Accessibility functions
    isScreenReaderEnabled: accessibility.isScreenReaderEnabled,
    isHighContrast: accessibility.isHighContrast,
    fontSize: accessibility.fontSize,
    reducedMotion: accessibility.reducedMotion,
    getAccessibleStyles: accessibility.getAccessibleStyles,
    generateAccessibleLabel: accessibility.generateAccessibleLabel,
    announceForAccessibility: accessibility.announceForAccessibility,
    
    // Theme functions
    theme: theme.theme,
    isDarkMode: theme.isDarkMode,
    currentTheme: theme.currentTheme,
    setTheme: theme.setTheme,
    isAutoMode: theme.isAutoMode,
    setAutoMode: theme.setAutoMode,
    getCategoryColor: theme.getCategoryColor,
    getStatusBarStyle: theme.getStatusBarStyle,
  };
};

// Provider components
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(translationService.getCurrentLanguage());
  const [supportedLanguages] = useState(translationService.getSupportedLanguages());

  const setLanguage = async (languageCode) => {
    await translationService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  const t = (key, params) => translationService.t(key, params);

  const value = {
    t,
    currentLanguage,
    supportedLanguages,
    setLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const AccessibilityProvider = ({ children }) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(
    accessibilityService.isScreenReaderEnabled()
  );
  const [isHighContrast, setIsHighContrast] = useState(
    accessibilityService.isHighContrastEnabled()
  );
  const [fontSize, setFontSize] = useState(accessibilityService.getFontSize());
  const [reducedMotion, setReducedMotion] = useState(
    accessibilityService.isReducedMotionEnabled()
  );

  useEffect(() => {
    // Listen for accessibility changes
    const interval = setInterval(() => {
      const currentScreenReader = accessibilityService.isScreenReaderEnabled();
      if (currentScreenReader !== isScreenReaderEnabled) {
        setIsScreenReaderEnabled(currentScreenReader);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isScreenReaderEnabled]);

  const updateHighContrast = async (enabled) => {
    await accessibilityService.setHighContrast(enabled);
    setIsHighContrast(enabled);
  };

  const updateFontSize = async (size) => {
    await accessibilityService.setFontSize(size);
    setFontSize(size);
  };

  const updateReducedMotion = async (enabled) => {
    await accessibilityService.setReducedMotion(enabled);
    setReducedMotion(enabled);
  };

  const value = {
    isScreenReaderEnabled,
    isHighContrast,
    fontSize,
    reducedMotion,
    setHighContrast: updateHighContrast,
    setFontSize: updateFontSize,
    setReducedMotion: updateReducedMotion,
    getAccessibleStyles: accessibilityService.getAccessibleStyles.bind(accessibilityService),
    generateAccessibleLabel: accessibilityService.generateAccessibleLabel.bind(accessibilityService),
    announceForAccessibility: accessibilityService.announceForScreenReader.bind(accessibilityService),
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themeService.getCurrentTheme());
  const [theme, setThemeData] = useState(themeService.getTheme());
  const [isAutoMode, setAutoModeState] = useState(themeService.isAutoMode());

  useEffect(() => {
    const unsubscribe = themeService.subscribe((newTheme, newThemeData) => {
      setCurrentTheme(newTheme);
      setThemeData(newThemeData);
    });

    return unsubscribe;
  }, []);

  const setTheme = (themeName) => {
    themeService.setTheme(themeName);
  };

  const setAutoMode = (enabled) => {
    themeService.setAutoMode(enabled);
    setAutoModeState(enabled);
  };

  const value = {
    theme,
    isDarkMode: currentTheme === 'dark',
    currentTheme,
    setTheme,
    isAutoMode,
    setAutoMode,
    getCategoryColor: themeService.getCategoryColor.bind(themeService),
    getStatusBarStyle: themeService.getStatusBarStyle.bind(themeService),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Combined provider
export const InclusiveProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
};