import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const communityService = {
    // Get all posts with optional filtering
    getPosts: async (filters = {}) => {
        try {
            const response = await axiosInstance.get('community/posts/', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error.response?.data || error;
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            const response = await axiosInstance.post('community/posts/', postData);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error.response?.data || error;
        }
    },

    // Add a comment to a post
    addComment: async (postId, commentData) => {
        try {
            const response = await axiosInstance.post(`community/posts/${postId}/comments/`, commentData);
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error.response?.data || error;
        }
    },

    // Add a reply to a comment
    addReply: async (postId, commentId, replyData) => {
        try {
            const response = await axiosInstance.post(
                `community/posts/${postId}/comments/${commentId}/replies/`,
                replyData
            );
            return response.data;
        } catch (error) {
            console.error('Error adding reply:', error);
            throw error.response?.data || error;
        }
    },

    // React to a post (like, love, etc.)
    reactToPost: async (postId, reactionType) => {
        try {
            const response = await axiosInstance.post(`community/posts/${postId}/react/`, {
                reaction_type: reactionType
            });
            return response.data;
        } catch (error) {
            console.error('Error reacting to post:', error);
            throw error.response?.data || error;
        }
    },

    // Delete a post
    deletePost: async (postId) => {
        try {
            const response = await axiosInstance.delete(`community/posts/${postId}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error.response?.data || error;
        }
    },

    // Delete a comment
    deleteComment: async (postId, commentId) => {
        try {
            const response = await axiosInstance.delete(
                `community/posts/${postId}/comments/${commentId}/`
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error.response?.data || error;
        }
    },

    // Delete a reply
    deleteReply: async (postId, commentId, replyId) => {
        try {
            const response = await axiosInstance.delete(
                `community/posts/${postId}/comments/${commentId}/replies/${replyId}/`
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting reply:', error);
            throw error.response?.data || error;
        }
    }
};
export default communityService; 