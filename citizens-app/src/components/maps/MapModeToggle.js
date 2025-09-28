import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MapModeToggle = ({ currentMode, onToggle, style }) => {
  const isLightweight = currentMode === 'lightweight';
  
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onToggle(isLightweight ? 'full' : 'lightweight')}
    >
      <Ionicons 
        name={isLightweight ? 'map-outline' : 'list-outline'} 
        size={16} 
        color="#2196F3" 
      />
      <Text style={styles.text}>
        {isLightweight ? 'Map View' : 'List View'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  text: {
    marginLeft: 6,
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
});

export default MapModeToggle;