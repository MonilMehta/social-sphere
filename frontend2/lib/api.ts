import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from './config';

// Configure axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(API_CONFIG.COOKIES.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
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

export interface Post {
  _id: string;
  caption: string;
  mediaFile: string[];
  postedBy: {
    _id: string;
    name: string;
    username: string;
    profilepic?: string;
  };
  numberOfLikes: number;
  numberOfComments: number;
  hasUserLikedPost: boolean;
  likesOfPost: any[];
  CommentsOfPost: any[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface Comment {
  _id: string;
  content: string;
  commentedBy: {
    _id: string;
    name: string;
    username: string;
    profilepic?: string;
  };
  numberOfLikes: number;
  hasUserLikedComment: boolean;
  numberOfReplies: number;
  createdAt: string;
}

export interface Reply {
  _id: string;
  content: string;
  repliedBy: {
    _id: string;
    name: string;
    username: string;
    profilepic?: string;
  };
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilepic?: string;
  bio?: string;
  location?: string;
  interests?: string | string[];
  isVerified: boolean;
  isPrivate: boolean;
  followerCount?: number;
  followingCount?: number;
  mutualFollowersCount?: number;
  commonInterests?: number;
  recommendationScore?: number;
}

export interface Chat {
  _id: string;
  participants: User[];
  isGroupChat: boolean;
  chatName?: string;
  groupAdmin?: string;
  lastMessage?: Message | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  sender: User;
  chat: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  replyTo?: Message;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  users?: User[];
  posts?: Post[];
  hashtags?: string[];
}

export interface TrendingHashtag {
  hashtag: string;
  count: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers?: number;
  totalChats?: number;
  hasMore: boolean;
}

// Posts API
export const postsAPI = {
  // Get all public posts
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.POSTS);
    return response.data.data;
  },

  // Get post by ID
  getPostById: async (postId: string): Promise<Post> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.POSTS}/${postId}`);
    return response.data.data[0];
  },

  // Create new post
  createPost: async (formData: FormData): Promise<Post> => {
    const response = await api.post(API_CONFIG.ENDPOINTS.POSTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update post
  updatePost: async (postId: string, caption: string): Promise<Post> => {
    const response = await api.patch(`${API_CONFIG.ENDPOINTS.POSTS}/${postId}`, { caption });
    return response.data.data;
  },

  // Delete post
  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`${API_CONFIG.ENDPOINTS.POSTS}/${postId}`);
  },

  // Toggle post visibility
  togglePublicStatus: async (postId: string): Promise<Post> => {
    const response = await api.patch(`${API_CONFIG.ENDPOINTS.TOGGLE_POST_VISIBILITY}/${postId}`);
    return response.data.data;
  },
};

// Likes API
export const likesAPI = {
  // Toggle post like
  togglePostLike: async (postId: string): Promise<any> => {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.TOGGLE_POST_LIKE}/${postId}`);
    return response.data.data;
  },

  // Toggle comment like
  toggleCommentLike: async (commentId: string): Promise<any> => {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.TOGGLE_COMMENT_LIKE}/${commentId}`);
    return response.data.data;
  },

  // Get liked posts
  getLikedPosts: async (): Promise<any[]> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.LIKED_POSTS);
    return response.data.data.likedPosts;
  },
};

// Comments API
export const commentsAPI = {
  // Get comments for a post
  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.COMMENTS}/${postId}`);
    return response.data.data;
  },

  // Create comment
  createComment: async (postId: string, content: string): Promise<Comment> => {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.COMMENTS}/${postId}`, { content });
    return response.data.data;
  },

  // Update comment
  updateComment: async (commentId: string, content: string): Promise<Comment> => {
    const response = await api.patch(`/comments/c/${commentId}`, { content });
    return response.data.data;
  },

  // Delete comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/c/${commentId}`);
  },
};

// Replies API
export const repliesAPI = {
  // Get replies for a comment
  getReplies: async (commentId: string): Promise<Reply[]> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.REPLIES}/${commentId}`);
    return response.data.data;
  },

  // Create reply
  createReply: async (commentId: string, content: string): Promise<Reply> => {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.REPLIES}/${commentId}`, { content });
    return response.data.data;
  },

  // Update reply
  updateReply: async (replyId: string, content: string): Promise<Reply> => {
    const response = await api.patch(`${API_CONFIG.ENDPOINTS.REPLY_BY_ID}/${replyId}`, { content });
    return response.data.data;
  },

  // Delete reply
  deleteReply: async (replyId: string): Promise<void> => {
    await api.delete(`${API_CONFIG.ENDPOINTS.REPLY_BY_ID}/${replyId}`);
  },
};

// Users API
export const usersAPI = {
  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.CURRENT_USER);
    return response.data.data;
  },

  // Get user by username
  getUserByUsername: async (username: string): Promise<User> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.USER_BY_USERNAME}/${username}`);
    return response.data.data;
  },
  // Update user profile
  updateProfile: async (formData: FormData): Promise<User> => {
    const response = await api.patch(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Change password
  changePassword: async (data: { oldPassword: string; newPassword: string }): Promise<void> => {
    const response = await api.post(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data.data;
  },
  // Get random users
  getRandomUsers: async (): Promise<User[]> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.RANDOM_USERS);
    return response.data.data;
  },

  // Get user profile by username
  getUserProfile: async (username: string): Promise<any> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.USER_BY_USERNAME}/${username}`);
    return response.data.data;
  },
};

// Follow API
export const followAPI = {
  // Toggle follow user
  toggleFollow: async (userId: string): Promise<any> => {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.FOLLOWS}/${userId}`);
    return response.data.data;
  },

  // Get user followers
  getFollowers: async (userId: string): Promise<User[]> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.FOLLOWERS}/${userId}`);
    return response.data.data.followers;
  },

  // Get user following
  getFollowing: async (userId: string): Promise<User[]> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.FOLLOWING}/${userId}`);
    return response.data.data.following;
  },
};

// Search API
export const searchAPI = {
  // Global search
  globalSearch: async (query: string, type: 'all' | 'users' | 'posts' = 'all', page = 1, limit = 20): Promise<SearchResult> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.GLOBAL_SEARCH}?query=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get recommended users
  getRecommendedUsers: async (page = 1, limit = 20): Promise<{ users: User[]; pagination: PaginationInfo }> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.RECOMMENDED_USERS}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get trending hashtags
  getTrendingHashtags: async (limit = 10): Promise<TrendingHashtag[]> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.TRENDING_HASHTAGS}?limit=${limit}`);
    return response.data.data;
  },

  // Search users with filters
  searchUsers: async (query: string, filters?: { location?: string; interests?: string[]; isVerified?: boolean }, page = 1, limit = 20): Promise<{ users: User[]; pagination: PaginationInfo }> => {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (filters?.location) params.append('location', filters.location);
    if (filters?.interests) params.append('interests', filters.interests.join(','));
    if (filters?.isVerified !== undefined) params.append('isVerified', filters.isVerified.toString());
    
    const response = await api.get(`${API_CONFIG.ENDPOINTS.SEARCH_USERS}?${params.toString()}`);
    return response.data.data;
  },
};

// Chat API
export const chatAPI = {
  // Get all chats
  getAllChats: async (page = 1, limit = 20): Promise<{ chats: Chat[]; pagination: PaginationInfo }> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.CHATS}?page=${page}&limit=${limit}`);
    return response.data.data;
  },
  // Create chat
  createChat: async (participantId?: string, participants?: string[], isGroupChat = false, chatName?: string): Promise<Chat> => {
    const payload: any = { isGroupChat };
    
    if (isGroupChat && participants) {
      payload.participants = participants;
      payload.chatName = chatName;
    } else if (participantId) {
      // For one-on-one chats, use participants array format
      payload.participants = [participantId];
    } else if (participants) {
      payload.participants = participants;
    }
    
    const response = await api.post(API_CONFIG.ENDPOINTS.CHATS, payload);
    return response.data.data;
  },
  // Get chat by ID
  getChatById: async (chatId: string): Promise<Chat> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}`);
    return response.data.data;
  },

  // Add participant to group chat
  addParticipant: async (chatId: string, userId: string): Promise<Chat> => {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/participants`, { userId });
    return response.data.data;
  },

  // Remove participant from group chat
  removeParticipant: async (chatId: string, participantId: string): Promise<Chat> => {
    const response = await api.delete(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/participants/${participantId}`);
    return response.data.data;
  },

  // Leave group chat
  leaveChat: async (chatId: string): Promise<void> => {
    await api.post(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/leave`);
  },

  // Delete chat
  deleteChat: async (chatId: string): Promise<void> => {
    await api.delete(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}`);
  },
};

// Messages API
export const messagesAPI = {
  // Send message
  sendMessage: async (chatId: string, content: string, messageType = 'text', replyTo?: string, attachments?: FileList): Promise<Message> => {
    // For simple text messages, use form data to match API expectations
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('content', content);
    formData.append('messageType', messageType);
    
    if (replyTo) formData.append('replyTo', replyTo);
    if (attachments) {
      Array.from(attachments).forEach(file => formData.append('attachments', file));
    }
    
    const response = await api.post(API_CONFIG.ENDPOINTS.MESSAGES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  // Get messages for a chat
  getChatMessages: async (chatId: string, page = 1, limit = 50): Promise<{ messages: Message[]; pagination: PaginationInfo }> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.CHAT_MESSAGES}/${chatId}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Edit message
  editMessage: async (messageId: string, content: string): Promise<Message> => {
    const response = await api.patch(`${API_CONFIG.ENDPOINTS.MESSAGES}/${messageId}`, { content });
    return response.data.data;
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<void> => {
    await api.delete(`${API_CONFIG.ENDPOINTS.MESSAGES}/${messageId}`);
  },

  // Get unread message count
  getUnreadCount: async (): Promise<{ totalUnread: number; chatsWithUnread: number }> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.UNREAD_COUNT);
    return response.data.data;
  },  // Search messages
  searchMessages: async (chatId: string, query: string, page = 1, limit = 20): Promise<{ messages: Message[]; pagination: PaginationInfo }> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.SEARCH_MESSAGES}?chatId=${chatId}&query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data.data;
  },
};

// Image Upload Utility
export const imageAPI = {
  // Upload single image
  uploadImage: async (file: File, folder: string = 'posts'): Promise<{ url: string; key: string; bucket: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const result = await response.json();
    return result.data;
  },

  // Upload multiple images
  uploadMultipleImages: async (files: File[], folder: string = 'posts'): Promise<string[]> => {
    const uploadPromises = files.map(file => imageAPI.uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.url);
  },

  // Delete image
  deleteImage: async (key: string): Promise<void> => {
    const response = await fetch(`/api/upload?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete image');
    }
  },
};
