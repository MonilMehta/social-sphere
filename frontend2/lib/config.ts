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
    CURRENT_USER: '/users/me',
    REFRESH_TOKEN: '/users/refresh-token',
    
    // User endpoints
    USERS: '/users',
    USER_BY_USERNAME: '/users/profile',
    UPDATE_PROFILE: '/users/update-account',
    RANDOM_USERS: '/users/random-users',
    
    // Posts endpoints
    POSTS: '/posts',
    TOGGLE_POST_VISIBILITY: '/posts/toggle',
    
    // Likes endpoints
    TOGGLE_POST_LIKE: '/likes/p',
    TOGGLE_COMMENT_LIKE: '/likes/c',
    LIKED_POSTS: '/likes/posts',
    
    // Comments endpoints
    COMMENTS: '/comments/p',
    
    // Reply endpoints
    REPLIES: '/replies/c',
    REPLY_BY_ID: '/replies/r',
    
    // Follow endpoints
    FOLLOWS: '/follows/toggle',
    FOLLOWERS: '/follows/followers',
    FOLLOWING: '/follows/followings',
    
    // Search endpoints
    GLOBAL_SEARCH: '/search/global',
    SEARCH_USERS: '/search/users',
    RECOMMENDED_USERS: '/search/users/recommended',
    TRENDING_HASHTAGS: '/search/hashtags/trending',
    
    // Chat endpoints
    CHATS: '/chats',
    CHAT_BY_ID: '/chats',
    CHAT_PARTICIPANTS: '/chats',
    LEAVE_CHAT: '/chats',
    
    // Message endpoints
    MESSAGES: '/messages',
    CHAT_MESSAGES: '/messages/chat',
    UNREAD_COUNT: '/messages/unread/count',
    SEARCH_MESSAGES: '/messages/search',
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
