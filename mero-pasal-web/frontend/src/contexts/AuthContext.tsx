'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  email_verified: boolean;
  created_at: string;
}

interface Subscription {
  id: string;
  tier: 'basic' | 'pro';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  expires_at?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = apiClient.getToken();
      if (token) {
        await refreshAuth();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      apiClient.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const profileData = await apiClient.getProfile();
      setUser(profileData.user);
      setSubscription(profileData.subscription);
    } catch (error) {
      console.error('Auth refresh error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await apiClient.login(email, password);
      setUser(data.user);
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const data = await apiClient.register(userData);
      setUser(data.user);
      // New users get a default basic subscription
      await refreshAuth();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    setSubscription(null);
  };

  const value: AuthContextType = {
    user,
    subscription,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
