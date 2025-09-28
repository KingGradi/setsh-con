import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightTheme = {
  colors: {
    // Primary colors
    primary: '#2196F3',
    primaryDark: '#1976D2',
    primaryLight: '#BBDEFB',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    backgroundTertiary: '#FAFAFA',
    
    // Surface colors
    surface: '#FFFFFF',
    surfaceSecondary: '#F8F9FA',
    
    // Text colors
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverse: '#FFFFFF',
    
    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Category colors (reports)
    water: '#2196F3',
    electricity: '#FF9800',
    roads: '#F44336',
    waste: '#4CAF50',
    safety: '#9C27B0',
    
    // UI elements
    border: '#E0E0E0',
    divider: '#EEEEEE',
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.5)',
    
    // Input colors
    inputBackground: '#FFFFFF',
    inputBorder: '#DDDDDD',
    inputBorderFocused: '#2196F3',
    inputText: '#333333',
    inputPlaceholder: '#999999',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

const darkTheme = {
  colors: {
    // Primary colors
    primary: '#64B5F6',
    primaryDark: '#42A5F5',
    primaryLight: '#90CAF9',
    
    // Background colors
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2D2D2D',
    
    // Surface colors
    surface: '#1E1E1E',
    surfaceSecondary: '#2D2D2D',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textTertiary: '#999999',
    textInverse: '#000000',
    
    // Status colors
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    info: '#64B5F6',
    
    // Category colors (reports) - adjusted for dark mode
    water: '#64B5F6',
    electricity: '#FFB74D',
    roads: '#EF5350',
    waste: '#66BB6A',
    safety: '#BA68C8',
    
    // UI elements
    border: '#404040',
    divider: '#333333',
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.7)',
    
    // Input colors
    inputBackground: '#2D2D2D',
    inputBorder: '#404040',
    inputBorderFocused: '#64B5F6',
    inputText: '#FFFFFF',
    inputPlaceholder: '#999999',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

class ThemeService {
  constructor() {
    this.currentTheme = 'light';
    this.autoMode = true;
    this.listeners = new Set();
    
    this.init();
  }

  async init() {
    // Load saved theme preference
    await this.loadThemePreference();
    
    // Listen to system theme changes
    this.appearanceListener = Appearance.addChangeListener(({ colorScheme }) => {
      if (this.autoMode) {
        this.setTheme(colorScheme || 'light', false);
      }
    });

    // Set initial theme based on auto mode
    if (this.autoMode) {
      const systemTheme = Appearance.getColorScheme();
      this.setTheme(systemTheme || 'light', false);
    }
  }

  async loadThemePreference() {
    try {
      const themeData = await AsyncStorage.getItem('theme_preference');
      if (themeData) {
        const { theme, autoMode } = JSON.parse(themeData);
        this.currentTheme = theme || 'light';
        this.autoMode = autoMode !== undefined ? autoMode : true;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
  }

  async saveThemePreference() {
    try {
      const themeData = {
        theme: this.currentTheme,
        autoMode: this.autoMode,
      };
      await AsyncStorage.setItem('theme_preference', JSON.stringify(themeData));
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  setTheme(theme, savePreference = true) {
    if (['light', 'dark'].includes(theme) && theme !== this.currentTheme) {
      this.currentTheme = theme;
      
      if (savePreference) {
        this.saveThemePreference();
      }
      
      // Notify listeners
      this.notifyListeners();
    }
  }

  setAutoMode(enabled) {
    this.autoMode = enabled;
    
    if (enabled) {
      const systemTheme = Appearance.getColorScheme();
      this.setTheme(systemTheme || 'light', false);
    }
    
    this.saveThemePreference();
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getTheme() {
    return this.currentTheme === 'dark' ? darkTheme : lightTheme;
  }

  isDarkMode() {
    return this.currentTheme === 'dark';
  }

  isAutoMode() {
    return this.autoMode;
  }

  // Subscribe to theme changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentTheme, this.getTheme());
      } catch (error) {
        console.warn('Theme listener error:', error);
      }
    });
  }

  // Cleanup
  destroy() {
    if (this.appearanceListener) {
      this.appearanceListener.remove();
    }
    this.listeners.clear();
  }

  // Helper to get category color with theme consideration
  getCategoryColor(category) {
    const theme = this.getTheme();
    return theme.colors[category] || theme.colors.primary;
  }

  // Status bar style based on theme
  getStatusBarStyle() {
    return this.isDarkMode() ? 'light-content' : 'dark-content';
  }
}

export default new ThemeService();