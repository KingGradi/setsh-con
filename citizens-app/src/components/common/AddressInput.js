import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../hooks/useLocation';

const AddressInput = ({
  label = "Address",
  value,
  onChangeText,
  onLocationSelected, // Callback when location is selected (address, coordinates)
  placeholder = "Enter your address",
  style,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { getCurrentLocation, reverseGeocode } = useLocation();
  const searchTimeout = useRef(null);

  // Google Places API key - you'll need to add this to your .env file
  const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const searchPlaces = async (query) => {
    if (!query || query.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (!GOOGLE_PLACES_API_KEY) {
      console.warn('Google Places API key not found. Using mock predictions.');
      // Mock predictions for South African locations
      const mockPredictions = [
        {
          place_id: 'mock1',
          description: `${query}, Johannesburg, South Africa`,
          structured_formatting: {
            main_text: query,
            secondary_text: 'Johannesburg, South Africa'
          }
        },
        {
          place_id: 'mock2', 
          description: `${query}, Cape Town, South Africa`,
          structured_formatting: {
            main_text: query,
            secondary_text: 'Cape Town, South Africa'
          }
        },
        {
          place_id: 'mock3',
          description: `${query}, Durban, South Africa`,
          structured_formatting: {
            main_text: query,
            secondary_text: 'Durban, South Africa'
          }
        }
      ];
      setPredictions(mockPredictions);
      setShowPredictions(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:za&types=address&key=${GOOGLE_PLACES_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        setPredictions(data.predictions || []);
        setShowPredictions(true);
      } else {
        console.warn('Places API error:', data.status);
        setPredictions([]);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error('Places API request failed:', error);
      setPredictions([]);
      setShowPredictions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (text) => {
    setInputValue(text);
    onChangeText(text);

    // Clear existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for search
    searchTimeout.current = setTimeout(() => {
      searchPlaces(text);
    }, 300); // 300ms delay to avoid too many API calls
  };

  const handlePredictionSelect = async (prediction) => {
    const address = prediction.description;
    setInputValue(address);
    onChangeText(address);
    setShowPredictions(false);
    setPredictions([]);

    // If we have a real API key and place_id, we could get detailed coordinates
    // For now, we'll call the callback with just the address
    if (onLocationSelected) {
      onLocationSelected(address, null); // null coordinates for now
    }
  };

  const handleUseGPS = async () => {
    try {
      setGpsLoading(true);
      
      // Get current location
      const location = await getCurrentLocation();
      console.log('Got GPS location:', location);
      
      // Convert to address
      const address = await reverseGeocode(location.latitude, location.longitude);
      console.log('Reverse geocoded address:', address);
      
      if (address) {
        setInputValue(address);
        onChangeText(address);
        
        // Call the callback with address and coordinates
        if (onLocationSelected) {
          onLocationSelected(address, {
            lat: location.latitude,
            lng: location.longitude
          });
        }
        
        Alert.alert('Success', 'Your current location has been set as your address.');
      } else {
        Alert.alert('Error', 'Unable to determine address from your current location.');
      }
    } catch (error) {
      console.error('GPS location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please ensure location permissions are enabled.',
        [
          { text: 'OK', style: 'cancel' },
          { 
            text: 'Settings', 
            onPress: () => {
              // You could open device settings here
              Alert.alert('Settings', 'Please enable location permissions in your device settings.');
            }
          },
        ]
      );
    } finally {
      setGpsLoading(false);
    }
  };

  const renderPrediction = (item, index) => (
    <TouchableOpacity
      key={item.place_id || index}
      style={styles.predictionItem}
      onPress={() => handlePredictionSelect(item)}
    >
      <Ionicons name="location-outline" size={16} color="#666" style={styles.predictionIcon} />
      <View style={styles.predictionText}>
        <Text style={styles.predictionMainText}>
          {item.structured_formatting?.main_text || item.description}
        </Text>
        <Text style={styles.predictionSecondaryText}>
          {item.structured_formatting?.secondary_text || 'South Africa'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputRow}>
        <View style={[
          styles.inputContainer,
          isFocused && styles.focused
        ]}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={handleInputChange}
            placeholder={placeholder}
            onFocus={() => {
              setIsFocused(true);
              if (inputValue.length >= 3) {
                setShowPredictions(true);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay hiding predictions to allow selection
              setTimeout(() => setShowPredictions(false), 200);
            }}
            {...props}
          />
          {loading && (
            <ActivityIndicator size="small" color="#2196F3" style={styles.loadingIndicator} />
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.gpsButton, gpsLoading && styles.gpsButtonLoading]}
          onPress={handleUseGPS}
          disabled={gpsLoading}
        >
          {gpsLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="navigate" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {showPredictions && predictions.length > 0 && (
        <View style={styles.predictionsContainer}>
          <ScrollView
            style={styles.predictionsList}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {predictions.map((item, index) => renderPrediction(item, index))}
          </ScrollView>
        </View>
      )}

      <View style={styles.helpText}>
        <Text style={styles.helpTextContent}>
          💡 Start typing to see address suggestions or tap the GPS button to use your current location
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingRight: 8,
  },
  focused: {
    borderColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  gpsButton: {
    marginLeft: 8,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsButtonLoading: {
    backgroundColor: '#666',
  },
  predictionsContainer: {
    marginTop: 4,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionsList: {
    maxHeight: 200,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  predictionIcon: {
    marginRight: 12,
  },
  predictionText: {
    flex: 1,
  },
  predictionMainText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  predictionSecondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  helpText: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  helpTextContent: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});

export default AddressInput;