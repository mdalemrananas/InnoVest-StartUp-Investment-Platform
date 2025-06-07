import axios from 'axios';

const API_URL = 'http://localhost:8000/api/chat/messages/';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.access) {
            config.headers.Authorization = `Bearer ${user.access}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Response error:', error.response || error);
        return Promise.reject(error);
    }
);

class ChatService {
    // Get all users except current user
    async getUsers() {
        try {
            console.log('Fetching users...');
            const response = await axiosInstance.get('users/');
            console.log('Users response:', response.data);
            
            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format: expected an array of users');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Get conversation with a specific user
    async getConversation(userId) {
        try {
            console.log('Fetching conversation for user:', userId);
            const response = await axiosInstance.get(`conversation/?user_id=${userId}`);
            console.log('Conversation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }

    // Send a message
    async sendMessage(userId, message) {
        try {
            console.log('Sending message to user:', userId);
            const response = await axiosInstance.post('send/', {
                receiver: userId,
                message: message
            });
            console.log('Message sent response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Mark message as read
    async markAsRead(messageId) {
        try {
            console.log('Marking message as read:', messageId);
            const response = await axiosInstance.post(`${messageId}/mark_as_read/`);
            console.log('Mark as read response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    }
}

export default new ChatService(); 