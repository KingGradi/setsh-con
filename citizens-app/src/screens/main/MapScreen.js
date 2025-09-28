import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useLocation } from '../../hooks/useLocation';
import reportService from '../../services/reportService';
import { REPORT_CATEGORIES } from '../../config/api';
import PerformanceUtils from '../../utils/performanceUtils';

// Optimized MapScreen for better performance on low-spec Android devices
const MapScreen = ({ navigation, currentMapMode, switchMapMode }) => {
  const [reports, setReports] = useState([]);
  const [visibleReports, setVisibleReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: -26.2041,
    longitude: 28.0473,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const { getCurrentLocation } = useLocation();
  const mapRef = useRef(null);
  const regionUpdateTimeoutRef = useRef(null);

  // Performance-optimized map configuration
  const mapConfig = useMemo(() => {
    const isLowSpec = PerformanceUtils.isLowSpecDevice();
    
    return {
      provider: Platform.OS === 'android' ? 'google' : undefined,
      loadingEnabled: true,
      loadingIndicatorColor: '#2196F3',
      loadingBackgroundColor: '#ffffff',
      showsUserLocation: true,
      showsMyLocationButton: Platform.OS === 'ios', // Disabled on Android for performance
      showsCompass: false, // Disabled for performance
      showsScale: false, // Disabled for performance
      showsBuildings: false, // Disabled for performance
      showsTraffic: false, // Disabled for performance
      showsIndoors: false, // Disabled for performance
      toolbarEnabled: false, // Android specific - disabled for performance
      zoomEnabled: true,
      scrollEnabled: true,
      pitchEnabled: false, // Disabled for performance
      rotateEnabled: false, // Disabled for performance
      mapType: 'standard', // Use standard for better performance
      // Android specific optimizations
      ...(Platform.OS === 'android' && {
        cacheEnabled: true,
        loadingBackgroundColor: '#ffffff',
        moveOnMarkerPress: false, // Prevent automatic camera movements
      })
    };
  }, []);

  useEffect(() => {
    initializeMap();
  }, []);

  // Debounced region change handler to reduce API calls and improve performance
  const debouncedRegionChange = useCallback(
    PerformanceUtils.debounce((region) => {
      if (mapReady) {
        updateVisibleReports(region);
      }
    }, 1000), // Increased debounce time for Android
    [mapReady, reports]
  );

  const handleRegionChange = useCallback((region) => {
    setMapRegion(region);
    debouncedRegionChange(region);
  }, [debouncedRegionChange]);

  const initializeMap = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's current location first
      try {
        const location = await getCurrentLocation();
        const newRegion = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        setMapRegion(newRegion);
        
        // Load reports for the user's area with smaller radius
        await loadReportsInRegion(newRegion);
      } catch (locationError) {
        console.log('Could not get current location, using default:', locationError.message);
        // Load reports for default area
        await loadReportsInRegion(mapRegion);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReportsInRegion = async (region) => {
    try {
      // Calculate bounding box for the region
      const latitudeDelta = region.latitudeDelta || 0.1;
      const longitudeDelta = region.longitudeDelta || 0.1;
      
      // Get optimal limit based on zoom level and device capabilities
      const optimalLimit = PerformanceUtils.getOptimalMarkerLimit(region);
      
      // Load only reports in visible area with dynamic limit
      const reportsData = await reportService.getReports({ 
        limit: Math.min(optimalLimit, 15), // Cap at 15 for low-spec devices
        lat: region.latitude,
        lng: region.longitude,
        radius: Math.max(latitudeDelta, longitudeDelta) * 111 // Convert degrees to km approximately
      });
      
      const newReports = reportsData.reports || [];
      setReports(newReports);
      setVisibleReports(newReports);
    } catch (error) {
      console.log('Error loading reports:', error.message);
    }
  };

  const updateVisibleReports = (region) => {
    if (!reports.length) return;

    // Filter reports using performance utility
    const visible = reports.filter(report => 
      PerformanceUtils.isPointInRegion(
        { latitude: report.lat, longitude: report.lng }, 
        region
      )
    );

    // Apply performance-based limiting
    const optimalLimit = PerformanceUtils.getOptimalMarkerLimit(region);
    setVisibleReports(PerformanceUtils.limitArray(visible, optimalLimit));
  };

  const handleReportPress = useCallback((report) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  }, [navigation]);

  const getMarkerColor = useCallback((category) => {
    switch (category) {
      case 'water': return '#2196F3';
      case 'electricity': return '#FFC107';
      case 'roads': return '#FF5722';
      case 'waste': return '#4CAF50';
      case 'safety': return '#F44336';
      default: return '#9E9E9E';
    }
  }, []);

  // Highly optimized markers with minimal re-renders
  const reportMarkers = useMemo(() => {
    if (!mapReady || !visibleReports.length) return null;

    return visibleReports.map((report) => (
      <Marker
        key={`marker-${report.id}`}
        coordinate={{
          latitude: report.lat,
          longitude: report.lng,
        }}
        onPress={() => handleReportPress(report)}
        // Use custom marker for better performance on Android
        {...(Platform.OS === 'android' && {
          anchor: { x: 0.5, y: 0.5 },
          centerOffset: { x: 0, y: 0 },
        })}
      >
        <View style={styles.customMarker}>
          <View 
            style={[
              styles.markerDot, 
              { backgroundColor: getMarkerColor(report.category) }
            ]} 
          />
        </View>
      </Marker>
    ));
  }, [visibleReports, mapReady, handleReportPress, getMarkerColor]);

  const handleRefresh = useCallback(async () => {
    await loadReportsInRegion(mapRegion);
  }, [mapRegion]);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
    updateVisibleReports(mapRegion);
  }, [mapRegion]);

  if (loading) {
    return <LoadingSpinner message="Loading map..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={initializeMap}
        retryText="Retry"
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Map</Text>
        <View style={styles.headerActions}>
          <Text style={styles.reportCount}>
            {visibleReports.length} reports
          </Text>
          {switchMapMode && (
            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => switchMapMode('lightweight')}
            >
              <Ionicons name="list" size={16} color="#2196F3" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={handleRegionChange}
        onMapReady={handleMapReady}
        {...mapConfig}
      >
        {mapReady && reportMarkers}
      </MapView>

      <View style={styles.legend}>
        <View style={styles.legendHeader}>
          <Text style={styles.legendTitle}>Report Categories</Text>
          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={initializeMap}
          >
            <Ionicons name="locate" size={16} color="#2196F3" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.legendItems}>
          {REPORT_CATEGORIES.slice(0, 3).map((category) => (
            <View key={category.value} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: getMarkerColor(category.value) }
                ]} 
              />
              <Text style={styles.legendText}>{category.label}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Reports')}
        >
          <Text style={styles.viewAllText}>View All Reports</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportCount: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  refreshButton: {
    padding: 8,
  },
  modeButton: {
    padding: 8,
    marginRight: 4,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3, // Reduced for Android performance
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  myLocationButton: {
    padding: 4,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  viewAllButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MapScreen;