const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    companyName?: string;
    phone?: string;
  }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async refreshToken() {
    return this.request('/auth/refresh', { method: 'POST' });
  }

  // Subscription methods
  async getSubscriptionStatus() {
    return this.request('/subscriptions/status');
  }

  async upgradeSubscription() {
    return this.request('/subscriptions/upgrade', { method: 'POST' });
  }

  async downgradeSubscription() {
    return this.request('/subscriptions/downgrade', { method: 'POST' });
  }

  async getSubscriptionTiers() {
    return this.request('/subscriptions/tiers');
  }

  // Analytics methods
  async getAnalyticsGraphs(params: Record<string, string> = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/graphs?${queryString}`);
  }

  async getAdvancedAnalytics(params: Record<string, string> = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/advanced?${queryString}`);
  }

  async getDashboardSummary(params: Record<string, string> = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/dashboard/summary?${queryString}`);
  }

  async getProducts(params: Record<string, string> = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/products?${queryString}`);
  }

  // Insights methods
  async getMarketInsights(params: Record<string, string> = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/insights?${queryString}`);
  }

  async getInsightById(id: string) {
    return this.request(`/insights/${id}`);
  }

  async getInsightsSummary(params: Record<string, string> = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/insights/summary/overview?${queryString}`);
  }

  async getInsightsByCategory(category: string, params: Record<string, string> = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/insights/category/${category}?${queryString}`);
  }

  // User methods
  async updateProfile(userData: {
    fullName?: string;
    companyName?: string;
    phone?: string;
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request('/users/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getUserActivity(params: Record<string, string> = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/activity?${queryString}`);
  }

  // Token management
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  logout() {
    this.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
