import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ReportCard from '../../components/reports/ReportCard';
import { useLocation } from '../../hooks/useLocation';
import reportService from '../../services/reportService';

const LightweightMapScreen = ({ navigation, currentMapMode, switchMapMode }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const { getCurrentLocation } = useLocation();

  useEffect(() => {
    loadNearbyReports();
  }, []);

  const loadNearbyReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get user's current location
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        // Load nearby reports
        const reportsData = await reportService.getReports({ 
          limit: 10,
          lat: location.latitude,
          lng: location.longitude,
          radius: 5 // 5km radius
        });
        
        const reportsWithDistance = (reportsData.reports || []).map(report => ({
          ...report,
          distance: calculateDistance(
            location.latitude,
            location.longitude,
            report.lat,
            report.lng
          )
        }));

        // Sort by distance
        reportsWithDistance.sort((a, b) => a.distance - b.distance);
        setReports(reportsWithDistance);
      } catch (locationError) {
        // Fallback to general reports
        const reportsData = await reportService.getReports({ limit: 10 });
        setReports(reportsData.reports || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return Math.round(d * 100) / 100; // Round to 2 decimal places
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const handleReportPress = (report) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  };

  const handleViewOnMap = (report) => {
    // This could open an external map app or show a simple static map
    const url = `geo:${report.lat},${report.lng}?q=${report.lat},${report.lng}(${encodeURIComponent(report.title)})`;
    Alert.alert(
      'View Location',
      'Would you like to view this location in your map app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Map', onPress: () => {
          // On a real app, you'd use Linking.openURL(url)
          console.log('Would open:', url);
          Alert.alert('Info', `Location: ${report.address}`);
        }},
      ]
    );
  };

  const renderReport = ({ item: report }) => (
    <View style={styles.reportContainer}>
      <ReportCard
        report={report}
        onPress={handleReportPress}
        showUpvote={false}
      />
      <View style={styles.reportActions}>
        {report.distance && (
          <View style={styles.distanceContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.distanceText}>{report.distance} km away</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => handleViewOnMap(report)}
        >
          <Ionicons name="map-outline" size={16} color="#2196F3" />
          <Text style={styles.mapButtonText}>View Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="location-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Nearby Reports</Text>
      <Text style={styles.emptySubtitle}>
        No reports found in your area. Try refreshing or check back later.
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading nearby reports..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadNearbyReports}
        retryText="Retry"
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Reports</Text>
        <View style={styles.headerActions}>
          {switchMapMode && (
            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => switchMapMode('full')}
            >
              <Ionicons name="map" size={16} color="#2196F3" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadNearbyReports}
          >
            <Ionicons name="refresh" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={20} color="#2196F3" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>
            Using list view for better performance on your device.
          </Text>
          {switchMapMode && (
            <TouchableOpacity
              style={styles.switchModeLink}
              onPress={() => switchMapMode('full')}
            >
              <Text style={styles.switchModeText}>Try Map View →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  refreshButton: {
    padding: 8,
  },
  modeButton: {
    padding: 8,
    marginRight: 4,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  switchModeLink: {
    marginTop: 4,
  },
  switchModeText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  reportContainer: {
    marginBottom: 16,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 6,
  },
  mapButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default LightweightMapScreen;