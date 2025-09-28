import { AccessibilityInfo, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple accessibility service with default safe values
const accessibilityService = {
  // Default state values
  isScreenReaderEnabledState: false,
  isHighContrastEnabledState: false,
  fontSize: 'normal',
  reducedMotion: false,
  initialized: false,

  // Initialize the service (call this when app starts)
  async init() {
    if (this.initialized) return;
    
    try {
      // Check screen reader status
      this.isScreenReaderEnabledState = await AccessibilityInfo.isScreenReaderEnabled();
      
      // Listen for screen reader changes
      AccessibilityInfo.addEventListener('screenReaderChanged', (isEnabled) => {
        this.isScreenReaderEnabledState = isEnabled;
      });

      // Load saved preferences
      await this.loadPreferences();
      this.initialized = true;
    } catch (error) {
      console.warn('Failed to initialize accessibility service:', error);
      // Keep default values
      this.initialized = true;
    }
  },

  async loadPreferences() {
    try {
      const preferences = await AsyncStorage.getItem('accessibility_preferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        this.isHighContrastEnabledState = parsed.highContrast || false;
        this.fontSize = parsed.fontSize || 'normal';
        this.reducedMotion = parsed.reducedMotion || false;
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error);
    }
  },

  async savePreferences() {
    try {
      const preferences = {
        highContrast: this.isHighContrastEnabledState,
        fontSize: this.fontSize,
        reducedMotion: this.reducedMotion,
      };
      await AsyncStorage.setItem('accessibility_preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save accessibility preferences:', error);
    }
  },

  // Screen reader helpers
  isScreenReaderEnabled() {
    return this.isScreenReaderEnabledState;
  },

  // Generate accessible labels for complex elements
  generateAccessibleLabel(type, data) {
    switch (type) {
      case 'mapMarker':
        return `Report marker for ${data.category} issue: ${data.title}. Status: ${data.status}. Location: ${data.address}`;
      
      case 'reportCard':
        return `Report: ${data.title}. Category: ${data.category}. Status: ${data.status}. Created ${data.createdAt}`;
      
      case 'navigationTab':
        return `Navigate to ${data.label}${data.selected ? ', currently selected' : ''}`;
      
      case 'createReportButton':
        return 'Create new report. Double tap to open report creation form';
      
      case 'photoButton':
        return data.hasPhoto 
          ? 'Photo attached. Double tap to view or change photo'
          : 'Add photo to report. Double tap to select from camera or gallery';
      
      default:
        return data.title || data.label || 'Interactive element';
    }
  },

  // High contrast mode
  async setHighContrast(enabled) {
    this.isHighContrastEnabledState = enabled;
    await this.savePreferences();
  },

  isHighContrastEnabled() {
    return this.isHighContrastEnabledState;
  },

  // Font size helpers
  async setFontSize(size) {
    if (['normal', 'large', 'extraLarge'].includes(size)) {
      this.fontSize = size;
      await this.savePreferences();
    }
  },

  getFontSize() {
    return this.fontSize;
  },

  getFontSizeMultiplier() {
    switch (this.fontSize) {
      case 'large': return 1.2;
      case 'extraLarge': return 1.4;
      default: return 1.0;
    }
  },

  // Reduced motion helpers
  async setReducedMotion(enabled) {
    this.reducedMotion = enabled;
    await this.savePreferences();
  },

  isReducedMotionEnabled() {
    return this.reducedMotion;
  },

  // Get accessible styles for dynamic theming
  getAccessibleStyles() {
    const multiplier = this.getFontSizeMultiplier();
    const highContrast = this.isHighContrastEnabled();
    
    return {
      text: {
        fontSize: 16 * multiplier,
        color: highContrast ? '#000' : '#333',
        backgroundColor: highContrast ? '#fff' : 'transparent',
      },
      headingText: {
        fontSize: 24 * multiplier,
        fontWeight: '600',
        color: highContrast ? '#000' : '#333',
        backgroundColor: highContrast ? '#fff' : 'transparent',
      },
      button: {
        minHeight: 44 * Math.max(multiplier, 1.1),
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: highContrast ? '#000' : '#2196F3',
        borderWidth: highContrast ? 2 : 0,
        borderColor: highContrast ? '#000' : 'transparent',
      },
      buttonText: {
        fontSize: 16 * multiplier,
        fontWeight: '600',
        color: highContrast ? '#fff' : '#fff',
        textAlign: 'center',
      },
      input: {
        fontSize: 16 * multiplier,
        minHeight: 44 * Math.max(multiplier, 1.1),
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: highContrast ? 2 : 1,
        borderColor: highContrast ? '#000' : '#ddd',
        backgroundColor: highContrast ? '#fff' : '#fff',
        color: highContrast ? '#000' : '#333',
      },
      card: {
        backgroundColor: highContrast ? '#fff' : '#f8f8f8',
        borderWidth: highContrast ? 2 : 1,
        borderColor: highContrast ? '#000' : '#e0e0e0',
        padding: 16,
        margin: 8,
        shadowOpacity: highContrast ? 0 : 0.1,
        elevation: highContrast ? 0 : 2,
      },
    };
  },

  // Animation helpers
  getAnimationDuration(defaultDuration = 300) {
    return this.reducedMotion ? 0 : defaultDuration;
  },

  getTransition(defaultTransition = 'ease') {
    return this.reducedMotion ? 'none' : defaultTransition;
  },

  // Touch target helpers
  getMinTouchTarget() {
    const multiplier = this.getFontSizeMultiplier();
    return Math.max(44, 44 * multiplier);
  },

  // Focus management helpers
  announceForScreenReader(message) {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message);
    } else if (Platform.OS === 'android') {
      AccessibilityInfo.announceForAccessibilityWithOptions(message, {
        queue: false,
      });
    }
  },

  // Semantic helpers
  getAccessibilityHint(type) {
    switch (type) {
      case 'button':
        return 'Double tap to activate';
      case 'link':
        return 'Double tap to open';
      case 'textInput':
        return 'Double tap to edit';
      case 'switch':
        return 'Double tap to toggle';
      case 'slider':
        return 'Swipe up or down to adjust';
      default:
        return null;
    }
  },
};

export default accessibilityService;