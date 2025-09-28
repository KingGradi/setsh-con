import { Platform } from 'react-native';

export class PerformanceUtils {
  static isLowSpecDevice() {
    // Simple heuristic to detect if we're on a potentially low-spec device
    return Platform.OS === 'android';
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static limitArray(array, limit) {
    return array.length > limit ? array.slice(0, limit) : array;
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  static isPointInRegion(point, region, buffer = 0.1) {
    const { latitude: lat, longitude: lng } = point;
    const { latitude: centerLat, longitude: centerLng, latitudeDelta, longitudeDelta } = region;
    
    const latDiff = Math.abs(lat - centerLat);
    const lngDiff = Math.abs(lng - centerLng);
    
    return latDiff <= (latitudeDelta / 2 + buffer) && lngDiff <= (longitudeDelta / 2 + buffer);
  }

  static getOptimalMarkerLimit(region) {
    const area = region.latitudeDelta * region.longitudeDelta;
    
    if (area > 1) return 5;  // Very zoomed out
    if (area > 0.1) return 10; // Moderately zoomed out
    if (area > 0.01) return 20; // Normal zoom
    return 30; // Very zoomed in
  }
}

export default PerformanceUtils;