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
import { useTheme } from '../../hooks/useInclusive';
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
  const { theme, getCategoryColor, isDarkMode } = useTheme();
  const mapRef = useRef(null);
  const regionUpdateTimeoutRef = useRef(null);

  // Performance-optimized map configuration with theme awareness
  const mapConfig = useMemo(() => {
    const isLowSpec = PerformanceUtils.isLowSpecDevice();
    
    return {
      provider: Platform.OS === 'android' ? 'google' : undefined,
      loadingEnabled: true,
      loadingIndicatorColor: theme.colors.primary,
      loadingBackgroundColor: theme.colors.background,
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
      mapType: isDarkMode ? 'hybrid' : 'standard', // Use hybrid for dark mode
      // Android specific optimizations
      ...(Platform.OS === 'android' && {
        cacheEnabled: true,
        loadingBackgroundColor: theme.colors.background,
        moveOnMarkerPress: false, // Prevent automatic camera movements
      })
    };
  }, [theme, isDarkMode]);

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
        console.log('Got user location:', location);
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
        console.log('Could not get current location, using default region and loading all reports:', locationError.message);
        
        // Use default location (Johannesburg, South Africa as fallback)
        const defaultRegion = {
          latitude: -26.2041,
          longitude: 28.0473,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        };
        setMapRegion(defaultRegion);
        
        // Load all reports since we don't have user location
        try {
          const reportsData = await reportService.getReports({ limit: 50 });
          const allReports = reportsData.reports || [];
          console.log('Loaded all reports as fallback:', allReports.length);
          setReports(allReports);
          setVisibleReports(allReports);
        } catch (reportsError) {
          console.log('Failed to load reports:', reportsError.message);
          setError('Failed to load reports');
        }
      }
    } catch (err) {
      console.log('Map initialization failed:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReportsInRegion = async (region) => {
    try {
      console.log('Loading reports for region:', {
        lat: region.latitude,
        lng: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta
      });
      
      // First, try to load reports in the current region
      let reportsData;
      try {
        // Calculate a reasonable search radius (minimum 10km, maximum 100km)
        const latitudeDelta = region.latitudeDelta || 0.1;
        const longitudeDelta = region.longitudeDelta || 0.1;
        const radius = Math.max(10, Math.min(100, Math.max(latitudeDelta, longitudeDelta) * 111));
        
        console.log('Trying location-based search with radius:', radius, 'km');
        
        reportsData = await reportService.getReports({ 
          limit: 50, // Increased limit
          lat: region.latitude,
          lng: region.longitude,
          radius: radius
        });
        
        console.log('Location-based search returned:', reportsData.reports?.length || 0, 'reports');
      } catch (locationError) {
        console.log('Location-based search failed:', locationError.message);
        reportsData = null;
      }
      
      // If location-based search returns no results or fails, load all reports
      if (!reportsData || !reportsData.reports || reportsData.reports.length === 0) {
        console.log('Falling back to loading all reports');
        try {
          reportsData = await reportService.getReports({ limit: 50 });
          console.log('Fallback search returned:', reportsData.reports?.length || 0, 'reports');
        } catch (fallbackError) {
          console.log('Fallback search also failed:', fallbackError.message);
          reportsData = { reports: [] };
        }
      }
      
      const newReports = reportsData.reports || [];
      console.log('Final loaded reports:', newReports.length);
      console.log('Report details:', newReports.map(r => ({ 
        id: r.id, 
        title: r.title?.substring(0, 30) + '...', 
        lat: r.lat, 
        lng: r.lng,
        category: r.category 
      })));
      
      setReports(newReports);
      setVisibleReports(newReports);
    } catch (error) {
      console.log('Error loading reports:', error.message);
      setReports([]);
      setVisibleReports([]);
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
    // Use theme-aware colors
    const categoryColor = getCategoryColor(category);
    
    // Convert theme colors to marker pin colors
    switch (category) {
      case 'water': return isDarkMode ? '#64B5F6' : '#2196F3';
      case 'electricity': return isDarkMode ? '#FFB74D' : '#FF9800';
      case 'roads': return isDarkMode ? '#EF5350' : '#F44336';
      case 'waste': return isDarkMode ? '#66BB6A' : '#4CAF50';
      case 'safety': return isDarkMode ? '#BA68C8' : '#9C27B0';
      default: return isDarkMode ? '#EF5350' : '#F44336'; // Default to red for visibility
    }
  }, [getCategoryColor, isDarkMode]);

  const getMarkerColorHex = useCallback((category) => {
    switch (category) {
      case 'water': return '#2196F3';
      case 'electricity': return '#FF9800';
      case 'roads': return '#F44336';
      case 'waste': return '#4CAF50';
      case 'safety': return '#9C27B0';
      default: return '#F44336';
    }
  }, []);

  // Highly optimized markers with minimal re-renders using classic map pin icons
  const reportMarkers = useMemo(() => {
    if (!mapReady || !visibleReports.length) {
      console.log('Markers not ready:', { mapReady, visibleReportsCount: visibleReports.length });
      return null;
    }

    console.log('Rendering markers for', visibleReports.length, 'reports');

    return visibleReports.map((report) => {
      const lat = parseFloat(report.lat);
      const lng = parseFloat(report.lng);
      
      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng)) {
        console.log('Skipping report with invalid coordinates:', report.id, lat, lng);
        return null;
      }

      console.log('Creating marker for report:', { id: report.id, title: report.title, lat, lng });

      return (
        <Marker
          key={`marker-${report.id}`}
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}
          onPress={() => handleReportPress(report)}
          title={report.title}
          description={`${report.category} - ${report.address}`}
          pinColor={getMarkerColor(report.category)}
        />
      );
    }).filter(Boolean); // Remove null markers
  }, [visibleReports, mapReady, handleReportPress, getMarkerColor]);

  const handleRefresh = useCallback(async () => {
    console.log('Manual refresh triggered');
    try {
      setLoading(true);
      await loadReportsInRegion(mapRegion);
    } catch (error) {
      console.log('Refresh failed:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background,
        borderBottomColor: theme.colors.border 
      }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Community Map</Text>
        <View style={styles.headerActions}>
          <Text style={[styles.reportCount, { color: theme.colors.textSecondary }]}>
            {visibleReports.length} marker{visibleReports.length !== 1 ? 's' : ''}
          </Text>
          {switchMapMode && (
            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => switchMapMode('lightweight')}
            >
              <Ionicons name="list" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={20} color={theme.colors.primary} />
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
        {mapReady && (() => {
          console.log('Rendering markers in MapView. MapReady:', mapReady, 'Markers count:', visibleReports.length);
          return reportMarkers;
        })()}
      </MapView>

      <View style={[styles.legend, { 
        backgroundColor: theme.colors.surface,
        shadowColor: theme.colors.shadow 
      }]}>
        <View style={styles.legendHeader}>
          <Text style={[styles.legendTitle, { color: theme.colors.text }]}>Report Categories</Text>
          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={initializeMap}
          >
            <Ionicons name="locate" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.legendItems}>
          {REPORT_CATEGORIES.slice(0, 3).map((category) => (
            <View key={category.value} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: getCategoryColor(category.value) }
                ]} 
              />
              <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>{category.label}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={[styles.viewAllButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Reports')}
        >
          <Text style={[styles.viewAllText, { color: theme.colors.textInverse }]}>View All Reports</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportCount: {
    fontSize: 12,
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
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 16,
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
    flex: 1,
  },
  viewAllButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MapScreen;