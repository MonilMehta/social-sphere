'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilepic?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
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
      const token = Cookies.get('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token and get user data
      const response = await axios.get('/users/current-user');
      setUser(response.data.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/users/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response.data.data;
      
      // Store tokens in cookies
      Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day
      Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/users/register', {
        name,
        username,
        email,
        password,
      });

      // Auto-login after successful signup
      return await login(email, password);
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
    window.location.href = '/';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
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
