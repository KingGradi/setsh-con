import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useInclusive } from '../../hooks/useInclusive';

const SettingsScreen = ({ navigation }) => {
  const {
    t,
    currentLanguage,
    supportedLanguages,
    setLanguage,
    theme,
    isDarkMode,
    currentTheme,
    setTheme,
    isAutoMode,
    setAutoMode,
    isHighContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    isScreenReaderEnabled,
  } = useInclusive();

  const handleLanguageSelection = () => {
    const languageOptions = supportedLanguages.map(lang => ({
      text: `${lang.nativeName} (${lang.name})`,
      onPress: () => setLanguage(lang.code),
      style: currentLanguage === lang.code ? 'default' : 'cancel',
    }));

    languageOptions.push({
      text: t('common.cancel'),
      style: 'cancel',
    });

    Alert.alert(
      'Select Language / Kies Taal / Khetha Ulimi',
      'Choose your preferred language / Kies jou voorkeur taal / Khetha ulimi olukhetha',
      languageOptions
    );
  };

  const handleThemeSelection = () => {
    const options = [
      {
        text: t('settings.theme.auto'),
        onPress: () => setAutoMode(true),
        style: isAutoMode ? 'default' : 'cancel',
      },
      {
        text: t('settings.theme.light'),
        onPress: () => {
          setAutoMode(false);
          setTheme('light');
        },
        style: !isAutoMode && currentTheme === 'light' ? 'default' : 'cancel',
      },
      {
        text: t('settings.theme.dark'),
        onPress: () => {
          setAutoMode(false);
          setTheme('dark');
        },
        style: !isAutoMode && currentTheme === 'dark' ? 'default' : 'cancel',
      },
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
    ];

    Alert.alert(t('settings.theme.title'), t('settings.theme.description'), options);
  };

  const handleFontSizeSelection = () => {
    const options = [
      {
        text: t('settings.fontSize.normal'),
        onPress: () => setFontSize('normal'),
        style: fontSize === 'normal' ? 'default' : 'cancel',
      },
      {
        text: t('settings.fontSize.large'),
        onPress: () => setFontSize('large'),
        style: fontSize === 'large' ? 'default' : 'cancel',
      },
      {
        text: t('settings.fontSize.extraLarge'),
        onPress: () => setFontSize('extraLarge'),
        style: fontSize === 'extraLarge' ? 'default' : 'cancel',
      },
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
    ];

    Alert.alert(t('settings.fontSize.title'), t('settings.fontSize.description'), options);
  };

  const getCurrentLanguageName = () => {
    const lang = supportedLanguages.find(l => l.code === currentLanguage);
    return lang ? lang.nativeName : 'English';
  };

  const getCurrentThemeName = () => {
    if (isAutoMode) return t('settings.theme.auto');
    return isDarkMode ? t('settings.theme.dark') : t('settings.theme.light');
  };

  const getCurrentFontSizeName = () => {
    return t(`settings.fontSize.${fontSize}`);
  };

  const styles = getStyles(theme, fontSize);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('a11y.backButton')}
          accessibilityHint={t('a11y.backButton.hint')}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('settings.title')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('settings.language.title')}
          </Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={handleLanguageSelection}
            accessibilityLabel={t('settings.language.current', { language: getCurrentLanguageName() })}
            accessibilityHint={t('settings.language.hint')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="language" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  {t('settings.language.label')}
                </Text>
                <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                  {getCurrentLanguageName()}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('settings.appearance.title')}
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={handleThemeSelection}
            accessibilityLabel={t('settings.theme.current', { theme: getCurrentThemeName() })}
            accessibilityHint={t('settings.theme.hint')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  {t('settings.theme.label')}
                </Text>
                <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                  {getCurrentThemeName()}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('settings.accessibility.title')}
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={handleFontSizeSelection}
            accessibilityLabel={t('settings.fontSize.current', { size: getCurrentFontSizeName() })}
            accessibilityHint={t('settings.fontSize.hint')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="text" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  {t('settings.fontSize.label')}
                </Text>
                <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                  {getCurrentFontSizeName()}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="contrast" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  {t('settings.accessibility.highContrast')}
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  {t('settings.accessibility.highContrast.description')}
                </Text>
              </View>
            </View>
            <Switch
              value={isHighContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={isHighContrast ? theme.colors.primary : theme.colors.textSecondary}
              accessibilityLabel={t('settings.accessibility.highContrast')}
              accessibilityHint={t('settings.accessibility.highContrast.hint')}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="walk" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  {t('settings.accessibility.reducedMotion')}
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  {t('settings.accessibility.reducedMotion.description')}
                </Text>
              </View>
            </View>
            <Switch
              value={reducedMotion}
              onValueChange={setReducedMotion}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={reducedMotion ? theme.colors.primary : theme.colors.textSecondary}
              accessibilityLabel={t('settings.accessibility.reducedMotion')}
              accessibilityHint={t('settings.accessibility.reducedMotion.hint')}
            />
          </View>

          {isScreenReaderEnabled && (
            <View style={[styles.infoBox, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }]}>
              <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                {t('settings.accessibility.screenReaderDetected')}
              </Text>
            </View>
          )}
        </View>

        {/* Help Text */}
        <View style={[styles.helpSection, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.helpTitle, { color: theme.colors.text }]}>
            {t('settings.help.title')}
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            {t('settings.help.description')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme, fontSize) => {
  const fontMultiplier = fontSize === 'large' ? 1.2 : fontSize === 'extraLarge' ? 1.4 : 1;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18 * fontMultiplier,
      fontWeight: '600',
    },
    placeholder: {
      width: 32,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20 * fontMultiplier,
      fontWeight: '600',
      marginHorizontal: 20,
      marginBottom: 12,
      marginTop: 8,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      minHeight: 70,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingText: {
      marginLeft: 16,
      flex: 1,
    },
    settingTitle: {
      fontSize: 16 * fontMultiplier,
      fontWeight: '500',
      marginBottom: 2,
    },
    settingValue: {
      fontSize: 14 * fontMultiplier,
    },
    settingDescription: {
      fontSize: 13 * fontMultiplier,
      marginTop: 2,
      lineHeight: 18 * fontMultiplier,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 20,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
    },
    infoText: {
      marginLeft: 12,
      fontSize: 14 * fontMultiplier,
      flex: 1,
      lineHeight: 20 * fontMultiplier,
    },
    helpSection: {
      margin: 20,
      padding: 16,
      borderRadius: 8,
    },
    helpTitle: {
      fontSize: 16 * fontMultiplier,
      fontWeight: '600',
      marginBottom: 8,
    },
    helpText: {
      fontSize: 14 * fontMultiplier,
      lineHeight: 20 * fontMultiplier,
    },
  });
};

export default SettingsScreen;