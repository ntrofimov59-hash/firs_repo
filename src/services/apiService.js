import { API_CONFIG, USE_MOCK_DATA } from '../config/apiConfig';
import errorHandler from '../utils/errorHandler';
import mockApiService from './mockApiService';

class ApiService {
  constructor(serviceName) {
    this.config = API_CONFIG[serviceName];
    this.baseURL = this.config.BASE_URL;
    this.serviceName = serviceName;
  }

  async request(endpoint, options = {}) {
    // Если используем тестовые данные, используем mock сервис
    if (USE_MOCK_DATA) {
      try {
        console.log(`API Service: Using mock data for ${this.serviceName}`);
        return await mockApiService.request(endpoint, options);
      } catch (error) {
        throw errorHandler.handleApiError(error, `${this.serviceName}_mock`);
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.config.API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: this.config.TIMEOUT,
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      // Логируем ошибку
      errorHandler.logError(error, {
        service: this.serviceName,
        endpoint,
        url
      });
      
      // Преобразуем в пользовательское сообщение
      const userError = errorHandler.handleApiError(error, this.serviceName);
      throw new Error(userError.message);
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default ApiService;