import AsyncStorage from '@react-native-async-storage/async-storage';

// South African languages translations
const translations = {
  // English (default)
  en: {
    // Navigation
    'nav.reports': 'Reports',
    'nav.map': 'Map',
    'nav.create': 'Create',
    'nav.myReports': 'My Reports',
    'nav.profile': 'Profile',
    
    // Common actions
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.continue': 'Continue',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Authentication
    'auth.login': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.homeAddress': 'Home Address',
    'auth.createAccount': 'Create Account',
    'auth.alreadyHaveAccount': 'Already have an account? Sign In',
    'auth.dontHaveAccount': "Don't have an account? Sign Up",
    
    // Reports
    'reports.title': 'Title',
    'reports.description': 'Description',
    'reports.category': 'Category',
    'reports.location': 'Location',
    'reports.photo': 'Photo',
    'reports.status': 'Status',
    'reports.createReport': 'Create Report',
    'reports.myReports': 'My Reports',
    'reports.noReports': 'No reports found',
    
    // Categories
    'category.water': 'Water Issues',
    'category.electricity': 'Electricity',
    'category.roads': 'Roads & Infrastructure',
    'category.waste': 'Waste Management',
    'category.safety': 'Safety & Security',
    
    // Accessibility
    'a11y.mapMarker': 'Report marker for {category} issue: {title}',
    'a11y.createReportButton': 'Create new report',
    'a11y.refreshButton': 'Refresh reports',
    'a11y.locationButton': 'Get current location',
    'a11y.photoButton': 'Add photo',
    'a11y.menuButton': 'Open menu',
    'a11y.backButton': 'Go back',
    'a11y.backButton.hint': 'Navigate to previous screen',

    // Settings
    'settings.title': 'Settings',
    'settings.language.title': 'Language',
    'settings.language.label': 'App Language',
    'settings.language.current': 'Current language: {language}',
    'settings.language.hint': 'Tap to change app language',
    'settings.appearance.title': 'Appearance',
    'settings.theme.title': 'Choose Theme',
    'settings.theme.label': 'Theme',
    'settings.theme.description': 'Select your preferred color theme',
    'settings.theme.auto': 'Automatic',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.current': 'Current theme: {theme}',
    'settings.theme.hint': 'Tap to change color theme',
    'settings.accessibility.title': 'Accessibility',
    'settings.fontSize.title': 'Text Size',
    'settings.fontSize.label': 'Text Size',
    'settings.fontSize.description': 'Choose your preferred text size',
    'settings.fontSize.normal': 'Normal',
    'settings.fontSize.large': 'Large',
    'settings.fontSize.extraLarge': 'Extra Large',
    'settings.fontSize.current': 'Current text size: {size}',
    'settings.fontSize.hint': 'Tap to change text size',
    'settings.accessibility.highContrast': 'High Contrast',
    'settings.accessibility.highContrast.description': 'Increase contrast for better visibility',
    'settings.accessibility.highContrast.hint': 'Toggle high contrast mode',
    'settings.accessibility.reducedMotion': 'Reduce Motion',
    'settings.accessibility.reducedMotion.description': 'Minimize animations and transitions',
    'settings.accessibility.reducedMotion.hint': 'Toggle reduced motion',
    'settings.accessibility.screenReaderDetected': 'Screen reader detected. The app is optimized for accessibility.',
    'settings.help.title': 'About Accessibility',
    'settings.help.description': 'These settings help make the app more accessible. Changes are automatically saved and applied immediately.',
  },
  
  // Afrikaans
  af: {
    // Navigation
    'nav.reports': 'Verslae',
    'nav.map': 'Kaart',
    'nav.create': 'Skep',
    'nav.myReports': 'My Verslae',
    'nav.profile': 'Profiel',
    
    // Common actions
    'common.submit': 'Dien In',
    'common.cancel': 'Kanselleer',
    'common.save': 'Bewaar',
    'common.loading': 'Laai...',
    'common.retry': 'Probeer Weer',
    'common.close': 'Sluit',
    'common.continue': 'Gaan Voort',
    'common.yes': 'Ja',
    'common.no': 'Nee',
    
    // Authentication
    'auth.login': 'Teken In',
    'auth.signup': 'Registreer',
    'auth.email': 'E-pos',
    'auth.password': 'Wagwoord',
    'auth.confirmPassword': 'Bevestig Wagwoord',
    'auth.fullName': 'Volledige Naam',
    'auth.homeAddress': 'Tuisadres',
    'auth.createAccount': 'Skep Rekening',
    'auth.alreadyHaveAccount': 'Het jy reeds \'n rekening? Teken In',
    'auth.dontHaveAccount': 'Het jy nie \'n rekening nie? Registreer',
    
    // Reports
    'reports.title': 'Titel',
    'reports.description': 'Beskrywing',
    'reports.category': 'Kategorie',
    'reports.location': 'Ligging',
    'reports.photo': 'Foto',
    'reports.status': 'Status',
    'reports.createReport': 'Skep Verslag',
    'reports.myReports': 'My Verslae',
    'reports.noReports': 'Geen verslae gevind nie',
    
    // Categories
    'category.water': 'Water Probleme',
    'category.electricity': 'Elektrisiteit',
    'category.roads': 'Paaie & Infrastruktuur',
    'category.waste': 'Afvalbestuur',
    'category.safety': 'Veiligheid & Sekuriteit',
    
    // Accessibility
    'a11y.mapMarker': 'Verslag merker vir {category} probleem: {title}',
    'a11y.createReportButton': 'Skep nuwe verslag',
    'a11y.refreshButton': 'Verfris verslae',
    'a11y.locationButton': 'Kry huidige ligging',
    'a11y.photoButton': 'Voeg foto by',
    'a11y.menuButton': 'Maak menu oop',
    'a11y.backButton': 'Gaan terug',
    'a11y.backButton.hint': 'Navigeer na vorige skerm',

    // Settings
    'settings.title': 'Instellings',
    'settings.language.title': 'Taal',
    'settings.language.label': 'App Taal',
    'settings.language.current': 'Huidige taal: {language}',
    'settings.language.hint': 'Tik om app taal te verander',
    'settings.appearance.title': 'Voorkoms',
    'settings.theme.title': 'Kies Tema',
    'settings.theme.label': 'Tema',
    'settings.theme.description': 'Kies jou voorkeur kleur tema',
    'settings.theme.auto': 'Outomaties',
    'settings.theme.light': 'Lig',
    'settings.theme.dark': 'Donker',
    'settings.theme.current': 'Huidige tema: {theme}',
    'settings.theme.hint': 'Tik om kleur tema te verander',
    'settings.accessibility.title': 'Toeganklikheid',
    'settings.fontSize.title': 'Teks Grootte',
    'settings.fontSize.label': 'Teks Grootte',
    'settings.fontSize.description': 'Kies jou voorkeur teks grootte',
    'settings.fontSize.normal': 'Normaal',
    'settings.fontSize.large': 'Groot',
    'settings.fontSize.extraLarge': 'Ekstra Groot',
    'settings.fontSize.current': 'Huidige teks grootte: {size}',
    'settings.fontSize.hint': 'Tik om teks grootte te verander',
    'settings.accessibility.highContrast': 'Hoë Kontras',
    'settings.accessibility.highContrast.description': 'Verhoog kontras vir beter sigbaarheid',
    'settings.accessibility.highContrast.hint': 'Skakel hoë kontras modus aan/af',
    'settings.accessibility.reducedMotion': 'Verminder Beweging',
    'settings.accessibility.reducedMotion.description': 'Minimaliseer animasies en oorgange',
    'settings.accessibility.reducedMotion.hint': 'Skakel verminderde beweging aan/af',
    'settings.accessibility.screenReaderDetected': 'Skermleser opgespoor. Die app is geoptimeer vir toeganklikheid.',
    'settings.help.title': 'Oor Toeganklikheid',
    'settings.help.description': 'Hierdie instellings help om die app meer toeganklik te maak. Veranderinge word outomaties gestoor en onmiddellik toegepas.',
  },
  
  // isiZulu
  zu: {
    // Navigation
    'nav.reports': 'Imibiko',
    'nav.map': 'Imephu',
    'nav.create': 'Dala',
    'nav.myReports': 'Imibiko Yami',
    'nav.profile': 'Iphrofayili',
    
    // Common actions
    'common.submit': 'Thumela',
    'common.cancel': 'Khansela',
    'common.save': 'Londoloza',
    'common.loading': 'Iyalayisha...',
    'common.retry': 'Zama Futhi',
    'common.close': 'Vala',
    'common.continue': 'Qhubeka',
    'common.yes': 'Yebo',
    'common.no': 'Cha',
    
    // Authentication
    'auth.login': 'Ngena',
    'auth.signup': 'Bhalisa',
    'auth.email': 'I-imeyili',
    'auth.password': 'Iphasiwedi',
    'auth.confirmPassword': 'Qinisekisa Iphasiwedi',
    'auth.fullName': 'Igama Eliphelele',
    'auth.homeAddress': 'Ikheli Lasekhaya',
    'auth.createAccount': 'Dala I-akhawunti',
    'auth.alreadyHaveAccount': 'Sele uneakhawunti? Ngena',
    'auth.dontHaveAccount': 'Awunawo i-akhawunti? Bhalisa',
    
    // Reports
    'reports.title': 'Isihloko',
    'reports.description': 'Incazelo',
    'reports.category': 'Isigaba',
    'reports.location': 'Indawo',
    'reports.photo': 'Isithombe',
    'reports.status': 'Isimo',
    'reports.createReport': 'Dala Umbiko',
    'reports.myReports': 'Imibiko Yami',
    'reports.noReports': 'Ayikho imibiko etholakele',
    
    // Categories
    'category.water': 'Izinkinga Zamanzi',
    'category.electricity': 'Ugesi',
    'category.roads': 'Imigwaqo Nezakhiwo',
    'category.waste': 'Ukuphatha Imfucuza',
    'category.safety': 'Ukuphepha Nezokuvikela',
    
    // Accessibility
    'a11y.mapMarker': 'Umaka wombiko we-{category} inkinga: {title}',
    'a11y.createReportButton': 'Dala umbiko omusha',
    'a11y.refreshButton': 'Vuselela imibiko',
    'a11y.locationButton': 'Thola indawo yamanje',
    'a11y.photoButton': 'Engeza isithombe',
    'a11y.menuButton': 'Vula imenyu',
    'a11y.backButton': 'Buyela emuva',
    'a11y.backButton.hint': 'Iya kusikrini esandulele',

    // Settings
    'settings.title': 'Izilungiselelo',
    'settings.language.title': 'Ulimi',
    'settings.language.label': 'Ulimi Lohlelo',
    'settings.language.current': 'Ulimi lwamanje: {language}',
    'settings.language.hint': 'Thepha ukuze ushintshe ulimi lohlelo',
    'settings.appearance.title': 'Ukubonakala',
    'settings.theme.title': 'Khetha Itimu',
    'settings.theme.label': 'Itimu',
    'settings.theme.description': 'Khetha itimu yombala oyithandayo',
    'settings.theme.auto': 'Ngokuzenzakalelayo',
    'settings.theme.light': 'Okukhanyayo',
    'settings.theme.dark': 'Okumnyama',
    'settings.theme.current': 'Itimu yamanje: {theme}',
    'settings.theme.hint': 'Thepha ukuze ushintshe itimu yombala',
    'settings.accessibility.title': 'Ukufinyeleleka',
    'settings.fontSize.title': 'Usayizi Wombhalo',
    'settings.fontSize.label': 'Usayizi Wombhalo',
    'settings.fontSize.description': 'Khetha usayizi wombhalo owuthandayo',
    'settings.fontSize.normal': 'Okuvamile',
    'settings.fontSize.large': 'Okukhulu',
    'settings.fontSize.extraLarge': 'Okukhulu Kakhulu',
    'settings.fontSize.current': 'Usayizi wombhalo wamanje: {size}',
    'settings.fontSize.hint': 'Thepha ukuze ushintshe usayizi wombhalo',
    'settings.accessibility.highContrast': 'Umehluko Omkhulu',
    'settings.accessibility.highContrast.description': 'Khulisa umehluko ukubona kangcono',
    'settings.accessibility.highContrast.hint': 'Vula/vala imodi yomuhluko omkhulu',
    'settings.accessibility.reducedMotion': 'Yehlisa Ukunyakaza',
    'settings.accessibility.reducedMotion.description': 'Yehlisa ama-animation noguquko',
    'settings.accessibility.reducedMotion.hint': 'Vula/vala ukunyakaza okunciphisiwe',
    'settings.accessibility.screenReaderDetected': 'Isifundi sesikrini sitholakele. Uhlelo lulungiselelwe ukufinyeleleka.',
    'settings.help.title': 'Mayelana Nokufinyeleleka',
    'settings.help.description': 'Lezi zilungiselelo zisiza ukwenza uhlelo lwazi lufinyeleleke kakhudlwana. Izinguquko ziyalondolozwa futhi zisetshenziswa ngokushesha.',
  },
  
  // isiXhosa
  xh: {
    // Navigation
    'nav.reports': 'Iingxelo',
    'nav.map': 'Imephu',
    'nav.create': 'Yenza',
    'nav.myReports': 'Iingxelo Zam',
    'nav.profile': 'Iprofayile',
    
    // Common actions
    'common.submit': 'Ngenisa',
    'common.cancel': 'Rhoxisa',
    'common.save': 'Gcina',
    'common.loading': 'Iyalayisha...',
    'common.retry': 'Phinda uzame',
    'common.close': 'Vala',
    'common.continue': 'Qhubeka',
    'common.yes': 'Ewe',
    'common.no': 'Hayi',
    
    // Authentication
    'auth.login': 'Ngena',
    'auth.signup': 'Bhalisa',
    'auth.email': 'I-imeyile',
    'auth.password': 'Iphasiwedi',
    'auth.confirmPassword': 'Qinisekisa iphasiwedi',
    'auth.fullName': 'Igama elipheleleyo',
    'auth.homeAddress': 'Idilesi yasekhaya',
    'auth.createAccount': 'Yenza i-akhawunti',
    'auth.alreadyHaveAccount': 'Sele une-akhawunti? Ngena',
    'auth.dontHaveAccount': 'Akune-akhawunti? Bhalisa',
    
    // Reports
    'reports.title': 'Isihloko',
    'reports.description': 'Inkcazo',
    'reports.category': 'Udidi',
    'reports.location': 'Indawo',
    'reports.photo': 'Ifoto',
    'reports.status': 'Imeko',
    'reports.createReport': 'Yenza ingxelo',
    'reports.myReports': 'Iingxelo zam',
    'reports.noReports': 'Akukho ngxelo ifunyenweyo',
    
    // Categories
    'category.water': 'Iingxaki zamanzi',
    'category.electricity': 'Umbane',
    'category.roads': 'Iindlela neziseko',
    'category.waste': 'Ukuphathwa kwenkunkuma',
    'category.safety': 'Ukhuseleko',
    
    // Accessibility
    'a11y.mapMarker': 'Uphawu lwengxelo ye-{category} ingxaki: {title}',
    'a11y.createReportButton': 'Yenza ingxelo entsha',
    'a11y.refreshButton': 'Hlaziya iingxelo',
    'a11y.locationButton': 'Fumana indawo yangoku',
    'a11y.photoButton': 'Yongeza ifoto',
    'a11y.menuButton': 'Vula imenyu',
    'a11y.backButton': 'Buyela umva',
    'a11y.backButton.hint': 'Hambisa kwisikrene esandulayo',

    // Settings
    'settings.title': 'Iisetingi',
    'settings.language.title': 'Ulwimi',
    'settings.language.label': 'Ulwimi Lwenkqubo',
    'settings.language.current': 'Ulwimi lwangoku: {language}',
    'settings.language.hint': 'Cofa ukutshintsha ulwimi lwenkqubo',
    'settings.appearance.title': 'Inkangeleko',
    'settings.theme.title': 'Khetha Umxholo',
    'settings.theme.label': 'Umxholo',
    'settings.theme.description': 'Khetha umxholo wombala owuthandayo',
    'settings.theme.auto': 'Ngokuzenzekelayo',
    'settings.theme.light': 'Okukhanyayo',
    'settings.theme.dark': 'Okumnyama',
    'settings.theme.current': 'Umxholo wangoku: {theme}',
    'settings.theme.hint': 'Cofa ukutshintsha umxholo wombala',
    'settings.accessibility.title': 'Ukufikeleleka',
    'settings.fontSize.title': 'Usayizi Wombhalo',
    'settings.fontSize.label': 'Usayizi Wombhalo',
    'settings.fontSize.description': 'Khetha usayizi wombhalo owuthandayo',
    'settings.fontSize.normal': 'Okuqhelekileyo',
    'settings.fontSize.large': 'Okukhulu',
    'settings.fontSize.extraLarge': 'Okukhulu Ngakumbi',
    'settings.fontSize.current': 'Usayizi wombhalo wangoku: {size}',
    'settings.fontSize.hint': 'Cofa ukutshintsha usayizi wombhalo',
    'settings.accessibility.highContrast': 'Umahluko Omkhulu',
    'settings.accessibility.highContrast.description': 'Yandisa umahluko ukubona ngcono',
    'settings.accessibility.highContrast.hint': 'Tshintsha imowudi yomahluko omkhulu',
    'settings.accessibility.reducedMotion': 'Nciphisa Intshukumo',
    'settings.accessibility.reducedMotion.description': 'Nciphisa iimpawu zokunyakaza notshintsho',
    'settings.accessibility.reducedMotion.hint': 'Tshintsha intshukumo encitshisiweyo',
    'settings.accessibility.screenReaderDetected': 'Isifundi sesiskrini sifunyenwe. Inkqubo ilungiselelwe ukufikeleleka.',
    'settings.help.title': 'Ngokukufike-leka',
    'settings.help.description': 'Ezi setingi zinceda ukwenza inkqubo ifikeleleke kakhulu. Iinguqulelo ziyagcinwa kwaye zisetyenziswa ngokukhawuleza.',
  },
};

class TranslationService {
  constructor() {
    this.currentLanguage = 'en'; // Default to English
    this.supportedLanguages = [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
      { code: 'zu', name: 'isiZulu', nativeName: 'isiZulu' },
      { code: 'xh', name: 'isiXhosa', nativeName: 'isiXhosa' },
    ];
    // Don't call loadSavedLanguage in constructor to avoid async issues
  }

  async loadSavedLanguage() {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && translations[savedLanguage]) {
        this.currentLanguage = savedLanguage;
      }
    } catch (error) {
      console.warn('Failed to load saved language:', error);
    }
  }

  async setLanguage(languageCode) {
    if (translations[languageCode]) {
      this.currentLanguage = languageCode;
      try {
        await AsyncStorage.setItem('app_language', languageCode);
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  t(key, params = {}) {
    const translation = translations[this.currentLanguage]?.[key] || translations.en[key] || key;
    
    // Replace parameters in translation
    if (Object.keys(params).length > 0) {
      return Object.entries(params).reduce((result, [param, value]) => {
        return result.replace(new RegExp(`{${param}}`, 'g'), value);
      }, translation);
    }
    
    return translation;
  }

  // Check if current language is RTL (none of SA languages are RTL, but keeping for future)
  isRTL() {
    return false; // South African languages are all LTR
  }
}

export default new TranslationService();