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

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Your Privacy Matters</Text>
        
        <Text style={styles.paragraph}>
          This Privacy Policy describes how Setshaba Connect ("we", "us", or "our") collects, 
          uses, and protects your information when you use our mobile application.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us, such as:{'\n'}
          • Account information (name, email, address){'\n'}
          • Report details and photos{'\n'}
          • Location data when reporting issues{'\n'}
          • Communication preferences
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:{'\n'}
          • Process and track your community reports{'\n'}
          • Communicate with you about your reports{'\n'}
          • Improve our services{'\n'}
          • Comply with legal obligations
        </Text>

        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.paragraph}>
          We may share your information with:{'\n'}
          • Municipal authorities and government agencies{'\n'}
          • Service providers who assist us{'\n'}
          • Law enforcement when required by law{'\n'}
          • With your consent for other purposes
        </Text>

        <Text style={styles.sectionTitle}>4. Location Information</Text>
        <Text style={styles.paragraph}>
          We collect location data to help identify and resolve community issues. 
          You can control location sharing through your device settings.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures to protect your personal information 
          against unauthorized access, alteration, disclosure, or destruction.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:{'\n'}
          • Access your personal information{'\n'}
          • Correct inaccurate information{'\n'}
          • Delete your account and data{'\n'}
          • Withdraw consent where applicable
        </Text>

        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our service is not intended for children under 13. We do not knowingly 
          collect personal information from children under 13.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you 
          of any changes by posting the new policy on this page.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy, please contact us:{'\n'}
          Email: [Privacy Email]{'\n'}
          Phone: [Privacy Phone]{'\n'}
          Address: [Privacy Address]
        </Text>

        <Text style={styles.lastUpdated}>
          Last updated: [Date]{'\n'}
          This policy is effective as of [Date].
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

export default PrivacyPolicyScreen;