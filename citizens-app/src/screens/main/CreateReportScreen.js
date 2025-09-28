import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Input from '../../components/common/Input';
import AddressInput from '../../components/common/AddressInput';
import Button from '../../components/common/Button';
import CategoryPicker from '../../components/reports/CategoryPicker';
import DuplicateReportModal from '../../components/reports/DuplicateReportModal';
import { useLocation } from '../../hooks/useLocation';
import reportService from '../../services/reportService';
import { findPotentialDuplicates } from '../../utils/duplicateDetection';

const CreateReportScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    photo_url: '',
    address: '', // Add address to form data
  });
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [potentialDuplicates, setPotentialDuplicates] = useState([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const { getCurrentLocation, reverseGeocode } = useLocation();

  useEffect(() => {
    getLocationData();
  }, []);

  const getLocationData = async () => {
    try {
      const location = await getCurrentLocation();
      const address = await reverseGeocode(location.latitude, location.longitude);
      
      const locationInfo = {
        lat: location.latitude,
        lng: location.longitude,
        address,
      };
      
      setLocationData(locationInfo);
      // Auto-populate the address field
      updateFormData('address', address);
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to get your location automatically. Please enter your address manually or use the GPS button.',
        [{ text: 'OK' }]
      );
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to add photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateFormData('photo_url', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateFormData('photo_url', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const removePhoto = () => {
    updateFormData('photo_url', '');
  };

  const validateForm = () => {
    const { title, description, category, address } = formData;

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }

    if (title.trim().length < 5) {
      Alert.alert('Error', 'Title must be at least 5 characters long');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }

    if (description.trim().length < 10) {
      Alert.alert('Error', 'Description must be at least 10 characters long');
      return false;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }

    if (!address || !address.trim()) {
      Alert.alert('Error', 'Please enter the location address');
      return false;
    }

    return true;
  };

  const checkForDuplicates = async (reportData) => {
    try {
      setCheckingDuplicates(true);
      console.log('Checking for duplicate reports near:', reportData.lat, reportData.lng);

      // Get nearby reports from the backend
      const nearbyReports = await reportService.checkNearbyReports(
        reportData.lat,
        reportData.lng,
        0.5, // 500m radius
        reportData.category
      );

      console.log('Found', nearbyReports.length, 'nearby reports for duplicate checking');

      // Find potential duplicates using our detection algorithm
      const duplicates = findPotentialDuplicates(reportData, nearbyReports, {
        maxDistance: 0.5, // 500 meters
        minKeywordSimilarity: 0.3, // 30% similarity
        maxAgeHours: 168, // 7 days
      });

      console.log('Detected', duplicates.length, 'potential duplicates');

      return duplicates;
    } catch (error) {
      console.warn('Duplicate check failed:', error.message);
      // Show a non-blocking notification that duplicate check failed
      // but allow the user to continue
      setTimeout(() => {
        Alert.alert(
          'Note',
          'Could not check for duplicate reports, but you can still submit your report.',
          [{ text: 'OK' }]
        );
      }, 100);
      return []; // Continue with submission if duplicate check fails
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Try to get coordinates from locationData, or geocode the address
    let lat = locationData?.lat;
    let lng = locationData?.lng;
    let finalAddress = formData.address.trim();

    // If we don't have coordinates but have an address, we'll use the address
    // The backend can handle geocoding if needed
    if (!lat || !lng) {
      console.log('No coordinates available, using address only');
    }

    const reportData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      lat: lat || null,
      lng: lng || null,
      address: finalAddress,
      photo_url: formData.photo_url || undefined,
    };

    console.log('Submitting report:', reportData);

    try {
      setLoading(true);

      // Check for potential duplicates first if we have coordinates
      if (lat && lng) {
        const duplicates = await checkForDuplicates(reportData);
        if (duplicates.length > 0) {
          // Show duplicate modal
          setPotentialDuplicates(duplicates);
          setDuplicateModalVisible(true);
          setLoading(false);
          return;
        }
      }

      // No duplicates found, proceed with submission
      await submitReport(reportData);
    } catch (error) {
      console.error('Unexpected error during report submission:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const submitReport = async (reportData, flagAsPotentialDuplicate = false) => {
    try {
      setLoading(true);

      // Add flag if this might be a duplicate
      const finalReportData = {
        ...reportData,
        ...(flagAsPotentialDuplicate && { 
          metadata: { 
            flagged_as_potential_duplicate: true,
            duplicate_check_performed: true,
          }
        }),
      };

      await reportService.createReport(finalReportData);

      Alert.alert(
        'Success',
        flagAsPotentialDuplicate 
          ? 'Your report has been submitted and flagged for review due to similar existing reports.'
          : 'Your report has been submitted successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvoteExisting = async (existingReport) => {
    try {
      setDuplicateModalVisible(false);
      setLoading(true);

      await reportService.upvoteReport(existingReport.id);

      Alert.alert(
        'Upvoted!',
        'Thank you for supporting the existing report instead of creating a duplicate.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upvote report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithNew = () => {
    setDuplicateModalVisible(false);
    
    const reportData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      lat: locationData.lat,
      lng: locationData.lng,
      address: locationData.address,
      photo_url: formData.photo_url || undefined,
    };

    // Submit with duplicate flag
    submitReport(reportData, true);
  };

  const handleViewExisting = (existingReport) => {
    setDuplicateModalVisible(false);
    navigation.navigate('ReportDetail', { reportId: existingReport.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Report</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Title"
          value={formData.title}
          onChangeText={(value) => updateFormData('title', value)}
          placeholder="Brief description of the issue"
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(value) => updateFormData('description', value)}
          placeholder="Provide detailed information about the issue"
          multiline
          numberOfLines={4}
        />

        <CategoryPicker
          selectedCategory={formData.category}
          onSelectCategory={(category) => updateFormData('category', category)}
        />

        <AddressInput
          label="Location"
          value={formData.address}
          onChangeText={(value) => {
            updateFormData('address', value);
            // Clear existing location data when user manually changes address
            setLocationData(null);
          }}
          placeholder="Enter the location of the issue"
          onLocationSelected={(address, coordinates) => {
            updateFormData('address', address);
            if (coordinates) {
              setLocationData({
                lat: coordinates.lat,
                lng: coordinates.lng,
                address: address,
              });
            }
          }}
        />

        <View style={styles.photoContainer}>
          <Text style={styles.label}>Photo (Optional)</Text>
          {formData.photo_url ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: formData.photo_url }} style={styles.photo} />
              <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addPhotoButton} onPress={showImagePicker}>
              <Ionicons name="camera-outline" size={32} color="#666" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {checkingDuplicates && (
          <View style={styles.checkingContainer}>
            <Ionicons name="search" size={16} color="#2196F3" />
            <Text style={styles.checkingText}>Checking for similar reports nearby...</Text>
          </View>
        )}

        <Button
          title={checkingDuplicates ? "Checking for duplicates..." : "Submit Report"}
          onPress={handleSubmit}
          loading={loading || checkingDuplicates}
          disabled={!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.address.trim()}
          style={styles.submitButton}
        />
      </ScrollView>

      <DuplicateReportModal
        visible={duplicateModalVisible}
        onClose={() => setDuplicateModalVisible(false)}
        duplicates={potentialDuplicates}
        onUpvoteExisting={handleUpvoteExisting}
        onContinueWithNew={handleContinueWithNew}
        onViewExisting={handleViewExisting}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  photoContainer: {
    marginBottom: 24,
  },
  addPhotoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  photoPreview: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  submitButton: {
    marginTop: 16,
  },
  checkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  checkingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
});

export default CreateReportScreen;