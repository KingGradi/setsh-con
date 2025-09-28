import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { supabase } from '../config/supabase';

class ReportService {
  async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  }

  async createReport(reportData) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REPORTS}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(reportData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create report');
      }

      return data.data.report;
    } catch (error) {
      throw error;
    }
  }

  async getReports(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.REPORTS}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reports');
      }

      return {
        reports: data.data.reports,
        total: data.data.total,
        limit: data.data.limit,
        offset: data.data.offset,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMyReports(filters = {}) {
    try {
      const headers = await this.getAuthHeaders();
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.MY_REPORTS}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch your reports');
      }

      return {
        reports: data.data.reports,
        total: data.data.total,
        limit: data.data.limit,
        offset: data.data.offset,
      };
    } catch (error) {
      throw error;
    }
  }

  async getReportById(reportId) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REPORTS}/${reportId}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch report');
      }

      return data.data.report;
    } catch (error) {
      throw error;
    }
  }

  async upvoteReport(reportId) {
    try {
      const headers = await this.getAuthHeaders();
      const url = API_ENDPOINTS.REPORT_UPVOTE.replace('{id}', reportId);
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upvote report');
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  async removeUpvote(reportId) {
    try {
      const headers = await this.getAuthHeaders();
      const url = API_ENDPOINTS.REPORT_UPVOTE.replace('{id}', reportId);
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove upvote');
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateReport(reportId, updates) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REPORTS}/${reportId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update report');
      }

      return data.data.report;
    } catch (error) {
      throw error;
    }
  }

  async checkNearbyReports(lat, lng, radius = 0.5, category = null) {
    try {
      const params = {
        lat: lat.toString(),
        lng: lng.toString(),
        radius: radius.toString(),
        limit: '20', // Limit to recent reports for duplicate checking
      };

      if (category) {
        params.category = category;
      }

      // Don't use created_after parameter as it might not be supported by backend
      // We'll filter by date on the frontend if needed

      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.REPORTS}?${queryParams}`;
      
      console.log('Checking nearby reports:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Nearby reports response status:', response.status);

      if (!response.ok) {
        // If the location-based API call fails, try without location parameters
        console.log('Location-based search failed, trying general search');
        const fallbackParams = { limit: '20' };
        if (category) fallbackParams.category = category;
        
        const fallbackUrl = `${API_BASE_URL}${API_ENDPOINTS.REPORTS}?${new URLSearchParams(fallbackParams).toString()}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const allReports = fallbackData.data?.reports || fallbackData.reports || [];
          console.log('Fallback search returned:', allReports.length, 'reports');
          return allReports;
        } else {
          throw new Error('Both location-based and fallback searches failed');
        }
      }

      const data = await response.json();
      const reports = data.data?.reports || data.reports || [];
      console.log('Nearby reports found:', reports.length);
      
      return reports;
    } catch (error) {
      console.warn('Failed to check for nearby reports:', error.message);
      console.log('Returning empty array to allow report creation to continue');
      return []; // Return empty array on error, don't block report creation
    }
  }

  async getStatusUpdates(reportId) {
    try {
      const url = API_ENDPOINTS.STATUS_UPDATES.replace('{reportId}', reportId);
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch status updates');
      }

      return data.data.status_updates;
    } catch (error) {
      throw error;
    }
  }
}

export default new ReportService();