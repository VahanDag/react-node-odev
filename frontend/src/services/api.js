import axios from 'axios';

const API_BASE_URL = window.location.origin;

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
