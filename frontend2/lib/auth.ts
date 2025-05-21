import Cookies from 'js-cookie';
import { API_CONFIG } from './config';

/**
 * Authentication utilities
 */
export const authUtils = {
  /**
   * Check if user is authenticated by verifying access token exists
   */
  isAuthenticated: (): boolean => {
    const token = Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN);
    return !!token;
  },

  /**
   * Get access token from cookies
   */
  getAccessToken: (): string | undefined => {
    return Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN);
  },

  /**
   * Get refresh token from cookies
   */
  getRefreshToken: (): string | undefined => {
    return Cookies.get(API_CONFIG.COOKIES.REFRESH_TOKEN);
  },

  /**
   * Clear all authentication tokens
   */
  clearTokens: (): void => {
    Cookies.remove(API_CONFIG.COOKIES.ACCESS_TOKEN);
    Cookies.remove(API_CONFIG.COOKIES.REFRESH_TOKEN);
  },

  /**
   * Store authentication tokens
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    Cookies.set(API_CONFIG.COOKIES.ACCESS_TOKEN, accessToken, {
      expires: API_CONFIG.COOKIES.ACCESS_TOKEN_EXPIRY,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    Cookies.set(API_CONFIG.COOKIES.REFRESH_TOKEN, refreshToken, {
      expires: API_CONFIG.COOKIES.REFRESH_TOKEN_EXPIRY,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },
};

export default authUtils;
