import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add withCredentials for CORS
    withCredentials: true
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request Config:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('Response Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        return Promise.reject(error);
    }
);

const getCompanies = async () => {
    try {
        console.log('Fetching companies...');
        const response = await axiosInstance.get('companies/');
        console.log('API Response:', response.data);
        
        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching companies:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.message || 'Failed to fetch companies');
    }
};

const getCompanyById = async (id) => {
    try {
        console.log(`Fetching company with ID: ${id}`);
        const response = await axiosInstance.get(`companies/${id}/`);
        console.log('Raw API Response:', response);
        console.log('Response Data:', response.data);
        console.log('Response Status:', response.status);
        
        // Check if we have a response with data
        if (response.data) {
            return response.data;
        }
        throw new Error('No data received from server');
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error('Company not found');
        }
        console.error('Error fetching company:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            stack: error.stack
        });
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch company details');
    }
};

const companyService = {
    getCompanies,
    getCompanyById,
};

export default companyService; 
