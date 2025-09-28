import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapScreen from '../../screens/main/MapScreen';
import LightweightMapScreen from './LightweightMapScreen';
import LoadingSpinner from '../common/LoadingSpinner';

const STORAGE_KEY = '@mapscreen_preference';
const PERFORMANCE_TEST_KEY = '@map_performance_test';

const AdaptiveMapScreen = ({ navigation }) => {
  const [mapMode, setMapMode] = useState(null); // null, 'full', 'lightweight'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    determineMapMode();
  }, []);

  const determineMapMode = async () => {
    try {
      // For development: Clear stored preferences to force re-detection
      // Remove this in production
      if (__DEV__) {
        await AsyncStorage.multiRemove([STORAGE_KEY, PERFORMANCE_TEST_KEY]);
      }

      // Check if user has manually set a preference
      const userPreference = await AsyncStorage.getItem(STORAGE_KEY);
      if (userPreference) {
        console.log('Using user preference:', userPreference);
        setMapMode(userPreference);
        setLoading(false);
        return;
      }

      // Check if we've already done a performance test
      const performanceResult = await AsyncStorage.getItem(PERFORMANCE_TEST_KEY);
      if (performanceResult) {
        console.log('Using cached performance result:', performanceResult);
        setMapMode(performanceResult);
        setLoading(false);
        return;
      }

      // Auto-detect based on device capabilities
      const shouldUseLightweight = await detectLowSpecDevice();
      const selectedMode = shouldUseLightweight ? 'lightweight' : 'full';
      
      console.log('Auto-detected map mode:', selectedMode);
      
      // Store the result for future use
      await AsyncStorage.setItem(PERFORMANCE_TEST_KEY, selectedMode);
      setMapMode(selectedMode);
    } catch (error) {
      console.log('Error determining map mode:', error);
      // Default to lightweight for safety
      setMapMode('lightweight');
    } finally {
      setLoading(false);
    }
  };

  const detectLowSpecDevice = async () => {
    try {
      // For now, we'll be conservative and assume most Android devices need lightweight mode
      if (Platform.OS === 'android') {
        // Default to lightweight for Android devices to ensure performance
        // Users can manually switch to full map if their device can handle it
        console.log('Android device detected - defaulting to lightweight mode for performance');
        return true;
      }

      // iOS devices generally handle maps better, but still be conservative
      if (Platform.OS === 'ios') {
        const majorVersionIOS = parseInt(Platform.Version.split('.')[0], 10);
        if (majorVersionIOS < 14) {
          console.log('Older iOS version detected - using lightweight mode');
          return true;
        }
        console.log('Modern iOS device detected - using full map mode');
        return false;
      }

      // Default to lightweight for unknown platforms
      return true;
    } catch (error) {
      console.log('Error detecting device capabilities:', error);
      // Default to lightweight for safety
      return true;
    }
  };

  const setUserMapPreference = async (mode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
      setMapMode(mode);
    } catch (error) {
      console.log('Error saving map preference:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Optimizing map for your device..." />;
  }

  // Pass the mode switcher to both components so users can manually switch
  const commonProps = {
    navigation,
    currentMapMode: mapMode,
    switchMapMode: setUserMapPreference,
  };

  if (mapMode === 'lightweight') {
    return <LightweightMapScreen {...commonProps} />;
  } else {
    return <MapScreen {...commonProps} />;
  }
};

export default AdaptiveMapScreen;