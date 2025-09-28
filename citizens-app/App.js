import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider } from './src/hooks/useAuth';
import { InclusiveProvider, useTheme } from './src/hooks/useInclusive';
import AppNavigator from './src/navigation/AppNavigator';
import accessibilityService from './src/services/accessibilityService';
import translationService from './src/services/translationService';
import themeService from './src/services/themeService';

// Main app component with theme awareness
const ThemedApp = () => {
  const { theme, getStatusBarStyle } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={getStatusBarStyle()} backgroundColor={theme.colors.background} />
      <AppNavigator />
    </View>
  );
};

export default function App() {
  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      try {
        await accessibilityService.init();
        await translationService.loadSavedLanguage();
        await themeService.init();
      } catch (error) {
        console.warn('Failed to initialize some services:', error);
      }
    };
    
    initializeServices();
  }, []);

  return (
    <InclusiveProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </InclusiveProvider>
  );
}