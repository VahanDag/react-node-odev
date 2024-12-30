const axios = require('axios');
const https = require('https');
require('dotenv').config();

class ApiService {
  constructor() {
    this.token = null;
    this.baseURL = process.env.API_BASE_URL;

    this.axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  async getToken() {
    try {
      const response = await this.axiosInstance.post(
        `${this.baseURL}/sessions`,
        {},
        {
          auth: {
            username: process.env.API_USERNAME,
            password: process.env.API_PASSWORD,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.response?.token) {
        this.token = response.data.response.token;
        return this.token;
      }
      throw new Error('Token alınamadı');
    } catch (error) {
      console.error('Token alma hatası:', error.message);
      throw error;
    }
  }

  async fetchAccountData() {
    try {
      if (!this.token) {
        await this.getToken();
      }

      const response = await this.axiosInstance.patch(
        `${this.baseURL}/layouts/testdb/records/1`,
        {
          fieldData: {},
          script: 'getData',
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.response?.scriptResult) {
        const data = JSON.parse(response.data.response.scriptResult);
        return data.map((account) => ({
          ...account,
          borc: account.borc || 0,
          alacak: account.alacak || 0,
          borcDoviz: account.borc_doviz || 0,
          alacakDoviz: account.alacak_doviz || 0,
        }));
      }
      throw new Error('Veri alınamadı');
    } catch (error) {
      console.error('Veri çekme hatası:', error.message);
      throw error;
    }
  }
}

module.exports = new ApiService();
