import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = {
  getAccounts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/accounts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },
};

export default api;
