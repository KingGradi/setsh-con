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
      // Check if user has manually set a preference
      const userPreference = await AsyncStorage.getItem(STORAGE_KEY);
      if (userPreference) {
        setMapMode(userPreference);
        setLoading(false);
        return;
      }

      // Check if we've already done a performance test
      const performanceResult = await AsyncStorage.getItem(PERFORMANCE_TEST_KEY);
      if (performanceResult) {
        setMapMode(performanceResult);
        setLoading(false);
        return;
      }

      // Auto-detect based on device capabilities
      const shouldUseLightweight = await detectLowSpecDevice();
      const selectedMode = shouldUseLightweight ? 'lightweight' : 'full';
      
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
      // Android-specific checks
      if (Platform.OS === 'android') {
        // These are hypothetical checks - in a real app you'd use actual device info
        // For now, we'll use simple heuristics
        
        // Check if we can determine device info
        const deviceInfo = {
          // These would come from a device info library
          totalMemory: 4, // GB - this is a placeholder
          apiLevel: Platform.Version,
        };

        // Simple heuristics for low-spec detection
        if (deviceInfo.totalMemory < 3) return true; // Less than 3GB RAM
        if (Platform.Version < 23) return true; // Android 6.0 or lower
        
        // Additional checks could include:
        // - CPU cores/speed
        // - Available storage
        // - GPU capabilities
        
        return false;
      }

      // iOS devices are generally more uniform, but still check older devices
      if (Platform.OS === 'ios') {
        const majorVersionIOS = parseInt(Platform.Version.split('.')[0], 10);
        return majorVersionIOS < 13; // iOS 13 or lower might struggle
      }

      return false;
    } catch (error) {
      console.log('Error detecting device capabilities:', error);
      // Default to low-spec assumption for safety
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