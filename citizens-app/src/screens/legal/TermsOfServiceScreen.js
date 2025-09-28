import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TermsOfServiceScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Welcome to Setshaba Connect</Text>
        
        <Text style={styles.paragraph}>
          These Terms of Service ("Terms") govern your use of the Setshaba Connect mobile application 
          ("App") operated by [Your Organization Name] ("we", "us", or "our").
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using this App, you accept and agree to be bound by the terms and 
          provision of this agreement.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of the Service</Text>
        <Text style={styles.paragraph}>
          You may use our App for reporting community issues, viewing municipal updates, and 
          engaging with local government services.
        </Text>

        <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          • Provide accurate and truthful information when reporting issues{'\n'}
          • Respect other users and community members{'\n'}
          • Do not submit false, misleading, or spam reports{'\n'}
          • Use the service only for legitimate community concerns
        </Text>

        <Text style={styles.sectionTitle}>4. Privacy and Data</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Please review our Privacy Policy to understand 
          how we collect, use, and protect your information.
        </Text>

        <Text style={styles.sectionTitle}>5. Content and Reports</Text>
        <Text style={styles.paragraph}>
          All reports and content submitted through the App become part of the public record 
          and may be shared with relevant municipal authorities.
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          We provide this service "as is" and make no warranties about the availability, 
          accuracy, or reliability of the service.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have questions about these Terms, please contact us at:{'\n'}
          Email: [Your Email]{'\n'}
          Phone: [Your Phone]{'\n'}
          Address: [Your Address]
        </Text>

        <Text style={styles.lastUpdated}>
          Last updated: [Date]{'\n'}
          These terms are effective as of [Date].
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 32,
    marginBottom: 20,
  },
});

export default TermsOfServiceScreen;