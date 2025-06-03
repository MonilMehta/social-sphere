'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from '@/lib/config';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilepic?: string;
  bio?: string;
  location?: string;
  interests: string[];
  isPrivate: boolean;
  isVerified: boolean;
  isOnline: boolean;
  searchScore: number;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.withCredentials = true;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    // Debug: Check all cookies
    console.log('All cookies:', document.cookie);
    console.log('Looking for cookie:', API_CONFIG.COOKIES.ACCESS_TOKEN);
    
    const token = Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN);
    console.log('Axios interceptor - Token found:', !!token);
    console.log('Axios interceptor - Token value:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Axios interceptor - Authorization header set');
    } else {
      console.log('Axios interceptor - No token found in cookies');
      
      // Try to manually parse the cookie
      const cookies = document.cookie.split(';');
      const accessTokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith(API_CONFIG.COOKIES.ACCESS_TOKEN + '=')
      );
      console.log('Manual cookie search result:', accessTokenCookie);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove(API_CONFIG.COOKIES.ACCESS_TOKEN);
      Cookies.remove(API_CONFIG.COOKIES.REFRESH_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN);
      if (!token) {
        setLoading(false);
        return;
      }      // Verify token and get user data
      const response = await axios.get(API_CONFIG.ENDPOINTS.CURRENT_USER);
      setUser(response.data.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove(API_CONFIG.COOKIES.ACCESS_TOKEN, { 
        secure: true, 
        sameSite: 'lax',
        path: '/'
      });
      Cookies.remove(API_CONFIG.COOKIES.REFRESH_TOKEN, { 
        secure: true, 
        sameSite: 'lax',
        path: '/'
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.LOGIN, {
        email,
        password,
      });      const { accessToken, refreshToken, user: userData } = response.data.data;
      
      // Store tokens in cookies with proper expiry
      Cookies.set(API_CONFIG.COOKIES.ACCESS_TOKEN, accessToken, { 
        expires: API_CONFIG.COOKIES.ACCESS_TOKEN_EXPIRY,
        secure: true,
        sameSite: 'lax',
        path: '/'
      });
      
      Cookies.set(API_CONFIG.COOKIES.REFRESH_TOKEN, refreshToken, { 
        expires: API_CONFIG.COOKIES.REFRESH_TOKEN_EXPIRY,
        secure: true,
        sameSite: 'lax',
        path: '/'
      });
      
      // Debug: Verify cookies were set
      console.log('Login - Cookies set. Verifying...');
      console.log('Document cookies after setting:', document.cookie);
      console.log('Access token from js-cookie:', Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN));
      console.log('Refresh token from js-cookie:', Cookies.get(API_CONFIG.COOKIES.REFRESH_TOKEN));
      
      setUser(userData);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const signup = async (name: string, username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.REGISTER, {
        name,
        username,
        email,
        password,
      });

      // Auto-login after successful signup
      return await login(email, password);
    } catch (error: any) {
      console.error('Signup failed:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      return { success: false, message };
    }
  };

  const refreshUser = async () => {
    try {
      const token = Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN);
      if (!token) return;

      const response = await axios.get(API_CONFIG.ENDPOINTS.CURRENT_USER);
      setUser(response.data.data);
    } catch (error) {
      console.error('User refresh failed:', error);
    }
  };  const logout = () => {
    Cookies.remove(API_CONFIG.COOKIES.ACCESS_TOKEN, { 
      secure: true, 
      sameSite: 'lax',
      path: '/'
    });
    Cookies.remove(API_CONFIG.COOKIES.REFRESH_TOKEN, { 
      secure: true, 
      sameSite: 'lax',
      path: '/'
    });
    setUser(null);
    window.location.href = '/';
  };
  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
