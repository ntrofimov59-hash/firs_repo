import AsyncStorage from '@react-native-async-storage/async-storage';

class SettingsService {
  constructor() {
    this.settingsKey = 'app_settings';
    this.apiConfigKey = 'api_config';
  }

  // Сохранение настроек
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(this.settingsKey, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  // Загрузка настроек
  async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem(this.settingsKey);
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Сохранение конфигурации API
  async saveApiConfig(apiConfig) {
    try {
      await AsyncStorage.setItem(this.apiConfigKey, JSON.stringify(apiConfig));
      return true;
    } catch (error) {
      console.error('Error saving API config:', error);
      return false;
    }
  }

  // Загрузка конфигурации API
  async loadApiConfig() {
    try {
      const apiConfig = await AsyncStorage.getItem(this.apiConfigKey);
      return apiConfig ? JSON.parse(apiConfig) : this.getDefaultApiConfig();
    } catch (error) {
      console.error('Error loading API config:', error);
      return this.getDefaultApiConfig();
    }
  }

  // Получение настроек по умолчанию
  getDefaultSettings() {
    return {
      notifications: true,
      sound: true,
      vibrations: true,
      autoRefresh: true,
      darkMode: false,
      language: 'ru',
      currency: 'RUB',
      syncInterval: 30,
      dataRetention: 90
    };
  }

  // Получение конфигурации API по умолчанию
  getDefaultApiConfig() {
    return {
      iiko: {
        apiKey: '',
        organizationId: '',
        baseUrl: 'https://api.iiko.com/api/1'
      },
      barline: {
        apiKey: '',
        baseUrl: 'https://api.barline.ru/api'
      },
      honestSign: {
        apiKey: '',
        baseUrl: 'https://api.crpt.ru/api/v3'
      }
    };
  }

  // Очистка всех данных
  async clearAllData() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  // Экспорт настроек
  async exportSettings() {
    try {
      const settings = await this.loadSettings();
      const apiConfig = await this.loadApiConfig();
      
      return {
        settings,
        apiConfig,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      console.error('Error exporting settings:', error);
      return null;
    }
  }

  // Импорт настроек
  async importSettings(data) {
    try {
      if (data.settings) {
        await this.saveSettings(data.settings);
      }
      if (data.apiConfig) {
        await this.saveApiConfig(data.apiConfig);
      }
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
}

export const settingsService = new SettingsService();