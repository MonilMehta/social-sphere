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

// Create a dedicated api instance for auth operations
const authAPI = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
});

// Add request interceptor for auth API
authAPI.interceptors.request.use(
  (config) => {
    const token = Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for auth API
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove(API_CONFIG.COOKIES.ACCESS_TOKEN);
      Cookies.remove(API_CONFIG.COOKIES.REFRESH_TOKEN);
      
      // Only redirect if we're in the browser (not during SSR)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN);
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token and get user data
      const response = await authAPI.get(API_CONFIG.ENDPOINTS.CURRENT_USER);
      setUser(response.data.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove(API_CONFIG.COOKIES.ACCESS_TOKEN);
      Cookies.remove(API_CONFIG.COOKIES.REFRESH_TOKEN);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {      const response = await authAPI.post(API_CONFIG.ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response.data.data;        // Store tokens in cookies with proper expiry
      Cookies.set(API_CONFIG.COOKIES.ACCESS_TOKEN, accessToken, { 
        expires: API_CONFIG.COOKIES.ACCESS_TOKEN_EXPIRY,
        secure: true,
        sameSite: 'lax'
      });
      
      Cookies.set(API_CONFIG.COOKIES.REFRESH_TOKEN, refreshToken, { 
        expires: API_CONFIG.COOKIES.REFRESH_TOKEN_EXPIRY,
        secure: true,
        sameSite: 'lax'
      });
      
      setUser(userData);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const signup = async (name: string, username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {      const response = await authAPI.post(API_CONFIG.ENDPOINTS.REGISTER, {
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
      if (!token) return;      const response = await authAPI.get(API_CONFIG.ENDPOINTS.CURRENT_USER);
      setUser(response.data.data);
    } catch (error) {
      console.error('User refresh failed:', error);
    }
  };

  const logout = () => {
    Cookies.remove(API_CONFIG.COOKIES.ACCESS_TOKEN);
    Cookies.remove(API_CONFIG.COOKIES.REFRESH_TOKEN);
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
