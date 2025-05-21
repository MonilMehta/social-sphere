// API Configuration
// This file allows for easy configuration changes when deploying

export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  
  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    CURRENT_USER: '/users/current-user',
    REFRESH_TOKEN: '/users/refresh-token',
    
    // User endpoints
    USERS: '/users',
    USER_BY_USERNAME: '/users/u',
    UPDATE_PROFILE: '/users/update-profile',
    SEARCH_USERS: '/users/search',
    
    // Posts endpoints
    POSTS: '/posts',
    TOGGLE_POST_VISIBILITY: '/posts/toggle/publish',
    
    // Likes endpoints
    TOGGLE_POST_LIKE: '/likes/toggle/p',
    TOGGLE_COMMENT_LIKE: '/likes/toggle/c',
    LIKED_POSTS: '/likes/posts',
    
    // Comments endpoints
    COMMENTS: '/comments',
    
    // Follow endpoints
    FOLLOWS: '/follows',
    UNFOLLOW: '/follows/unfollow',
    FOLLOWERS: '/follows/followers',
    FOLLOWING: '/follows/following',
  },
  
  // Cookie configuration
  COOKIES: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    ACCESS_TOKEN_EXPIRY: 1, // 1 day
    REFRESH_TOKEN_EXPIRY: 7, // 7 days
  },
};

export default API_CONFIG;
