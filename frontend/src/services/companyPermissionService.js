import axios from 'axios';
import { API_URL } from '../config';

const companyPermissionService = {
    requestAccess: async (companyId, userIntro, userPurpose) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const response = await axios.post(
                `${API_URL}company-permission/request/`,
                {
                    company: companyId,
                    user_intro: userIntro,
                    user_purpose: userPurpose,
                    ppt: 'accept',
                    request_access: 'yes'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${currentUser.access}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getPermission: async (companyId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`${API_URL}company-permission/${companyId}/`, {
            headers: { 'Authorization': `Bearer ${currentUser.access}` }
        });
        if (!response.ok) throw new Error('Failed to fetch permission');
        return response.json();
    }
};

export default companyPermissionService; 