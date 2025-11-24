// src/config/apiConfig.js
export const API_CONFIG = {
  IIKO: {
    BASE_URL: 'https://api.iiko.com/api',
    API_KEY: 'your_iiko_api_key',
    TIMEOUT: 30000
  },
  BARLINE: {
    BASE_URL: 'https://api.barline.ru/api',
    API_KEY: 'your_barline_api_key',
    TIMEOUT: 30000
  },
  HONEST_SIGN: {
    BASE_URL: 'https://api.crpt.ru/api',
    API_KEY: 'your_honest_sign_api_key',
    TIMEOUT: 30000
  }
};

// Флаг для использования тестовых данных (true - тестовые данные, false - реальные API запросы)
export const USE_MOCK_DATA = true;