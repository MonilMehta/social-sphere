import axios from 'axios';
import { API_CONFIG } from './config';

// Configure axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
});

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
  createdAt: string;
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

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilepic?: string;
  bio?: string;
  followers: number;
  following: number;
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
    const response = await api.patch(`${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}`, { content });
    return response.data.data;
  },

  // Delete comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}`);
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

  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.SEARCH_USERS}?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },
};

// Follow API
export const followAPI = {
  // Follow user
  followUser: async (userId: string): Promise<any> => {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.FOLLOWS}/${userId}`);
    return response.data.data;
  },

  // Unfollow user
  unfollowUser: async (userId: string): Promise<any> => {
    const response = await api.delete(`${API_CONFIG.ENDPOINTS.UNFOLLOW}/${userId}`);
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
