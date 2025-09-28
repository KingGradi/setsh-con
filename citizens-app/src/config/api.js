// API Configuration
import { API_BASE_URL as API_BASE_URL_ENV } from '@env';

export const API_BASE_URL = API_BASE_URL_ENV || 'https://setshaba-connect-backend.onrender.com/api';

console.log('API Base URL (from env):', API_BASE_URL_ENV);
console.log('API Base URL (final):', API_BASE_URL);

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  
  // Users
  USER_PROFILE: '/users/me',
  USER_BY_ID: '/users',
  
  // Reports
  REPORTS: '/reports',
  MY_REPORTS: '/reports/mine',
  MUNICIPALITY_REPORTS: '/reports/municipality',
  REPORT_UPVOTE: '/reports/{id}/upvote',
  
  // Municipalities
  MUNICIPALITIES: '/municipalities',
  MUNICIPALITY_BY_ID: '/municipalities/{id}',
  MUNICIPALITY_REPORTS: '/municipalities/{id}/reports',
  
  // Status Updates
  STATUS_UPDATES: '/reports/{reportId}/status',
};

export const REPORT_CATEGORIES = [
  { value: 'water', label: 'Water & Sanitation', icon: 'water' },
  { value: 'electricity', label: 'Electricity', icon: 'flash' },
  { value: 'roads', label: 'Roads & Transport', icon: 'car' },
  { value: 'waste', label: 'Waste Management', icon: 'trash' },
  { value: 'safety', label: 'Safety & Security', icon: 'shield' },
  { value: 'other', label: 'Other', icon: 'help-circle' },
];

export const REPORT_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#FFA500' },
  { value: 'acknowledged', label: 'Acknowledged', color: '#2196F3' },
  { value: 'in_progress', label: 'In Progress', color: '#FF9800' },
  { value: 'resolved', label: 'Resolved', color: '#4CAF50' },
];