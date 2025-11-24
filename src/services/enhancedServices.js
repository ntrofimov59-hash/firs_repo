import cacheManager from '../utils/cacheManager';
import syncManager from '../utils/syncManager';
import errorHandler from '../utils/errorHandler';

// Базовый класс для всех сервисов с кешированием
class EnhancedService {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.cachePrefix = `service_${serviceName}_`;
  }

  // Получение данных с кешированием
  async getWithCache(endpoint, params = {}, options = {}) {
    const {
      ttl = 5 * 60 * 1000, // 5 минут
      forceRefresh = false
    } = options;

    const cacheKey = this.generateCacheKey(endpoint, params);

    // Проверяем кеш если не принудительное обновление
    if (!forceRefresh) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        console.log(`📦 ${this.serviceName}: Using cached data for ${endpoint}`);
        return cachedData;
      }
    }

    try {
      console.log(`🔄 ${this.serviceName}: Fetching fresh data for ${endpoint}`);
      const data = await this.fetchData(endpoint, params);
      
      // Сохраняем в кеш
      cacheManager.set(cacheKey, data, ttl);
      
      return data;
    } catch (error) {
      // При ошибке пробуем вернуть данные из кеша, даже если они старые
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        console.warn(`📦 ${this.serviceName}: Using stale cache due to error:`, error.message);
        return cachedData;
      }
      
      throw error;
    }
  }

  // Инвалидация кеша
  invalidateCache(endpoint, params = {}) {
    const cacheKey = this.generateCacheKey(endpoint, params);
    cacheManager.delete(cacheKey);
    console.log(`🧹 ${this.serviceName}: Invalidated cache for ${endpoint}`);
  }

  // Инвалидация по префиксу
  invalidateCacheByPrefix(prefix) {
    const fullPrefix = `${this.cachePrefix}${prefix}`;
    cacheManager.deleteByPrefix(fullPrefix);
    console.log(`🧹 ${this.serviceName}: Invalidated cache with prefix ${prefix}`);
  }

  // Генерация ключа кеша (исправленная версия без Buffer)
  generateCacheKey(endpoint, params) {
    const paramsString = JSON.stringify(params);
    
    // Простая хеш-функция для строки (замена Buffer)
    let hash = 0;
    for (let i = 0; i < paramsString.length; i++) {
      const char = paramsString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `${this.cachePrefix}${endpoint}_${Math.abs(hash)}`;
  }

  // Абстрактный метод для получения данных (должен быть реализован в дочерних классах)
  async fetchData(endpoint, params) {
    throw new Error('fetchData method must be implemented');
  }
}

// Улучшенный сервис для ресторанов
export class EnhancedRestaurantService extends EnhancedService {
  constructor() {
    super('restaurants');
  }

  async fetchData(endpoint, params) {
    // Имитация API вызовов
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (endpoint) {
      case 'list':
        return {
          restaurants: [
            {
              id: 1,
              name: "Ресторан Восток",
              address: "ул. Пушкина, 1",
              phone: "+7 (495) 123-45-67",
              category: "Вверх",
              currentRevenue: 150000,
              isOpen: true,
              todaySales: 45,
              employees: Array.from({ length: 15 }, (_, i) => ({
                id: i + 1,
                name: `Сотрудник ${i + 1}`,
                position: i % 3 === 0 ? 'Повар' : i % 3 === 1 ? 'Официант' : 'Администратор',
                isActive: i < 12
              })),
              supplies: Array.from({ length: 8 }, (_, i) => ({
                id: i + 1,
                product: `Товар ${i + 1}`,
                quantity: Math.floor(Math.random() * 100) + 10,
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
              }))
            },
            {
              id: 2,
              name: "Ресторан Запад",
              address: "ул. Лермонтова, 25",
              phone: "+7 (495) 234-56-78",
              category: "Вверх",
              currentRevenue: 135000,
              isOpen: true,
              todaySales: 38,
              employees: Array.from({ length: 12 }, (_, i) => ({
                id: i + 16,
                name: `Сотрудник ${i + 16}`,
                position: i % 3 === 0 ? 'Повар' : i % 3 === 1 ? 'Официант' : 'Администратор',
                isActive: i < 10
              })),
              supplies: Array.from({ length: 6 }, (_, i) => ({
                id: i + 9,
                product: `Товар ${i + 9}`,
                quantity: Math.floor(Math.random() * 80) + 15,
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
              }))
            },
            {
              id: 3,
              name: "Ресторан Север",
              address: "пр. Мира, 15",
              phone: "+7 (495) 345-67-89",
              category: "Низ",
              currentRevenue: 110000,
              isOpen: false,
              todaySales: 0,
              employees: Array.from({ length: 10 }, (_, i) => ({
                id: i + 28,
                name: `Сотрудник ${i + 28}`,
                position: i % 3 === 0 ? 'Повар' : i % 3 === 1 ? 'Официант' : 'Администратор',
                isActive: false
              })),
              supplies: Array.from({ length: 4 }, (_, i) => ({
                id: i + 15,
                product: `Товар ${i + 15}`,
                quantity: Math.floor(Math.random() * 60) + 5,
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
              }))
            }
          ],
          timestamp: new Date().toISOString()
        };

      case 'details':
        return {
          id: params.id,
          name: `Ресторан ${params.id}`,
          address: `Адрес ресторана ${params.id}`,
          phone: "+7 (495) XXX-XX-XX",
          category: params.id % 2 === 0 ? "Вверх" : "Низ",
          currentRevenue: params.id * 25000,
          isOpen: params.id % 2 === 0,
          todaySales: params.id * 8,
          timestamp: new Date().toISOString()
        };

      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  // Создание ресторана с синхронизацией
  async createRestaurant(data) {
    const operation = {
      type: 'CREATE_RESTAURANT',
      data,
      endpoint: 'restaurants',
      method: 'POST'
    };

    // Добавляем в очередь синхронизации
    const operationId = await syncManager.queueOperation(operation);
    
    // Инвалидируем кеш списка ресторанов
    this.invalidateCache('list');
    
    return { operationId, status: 'queued' };
  }

  // Обновление ресторана
  async updateRestaurant(id, data) {
    const operation = {
      type: 'UPDATE_RESTAURANT',
      id,
      data,
      endpoint: `restaurants/${id}`,
      method: 'PUT'
    };

    const operationId = await syncManager.queueOperation(operation);
    
    // Инвалидируем кеш
    this.invalidateCache('list');
    this.invalidateCache('details', { id });
    
    return { operationId, status: 'queued' };
  }
}

// Улучшенный сервис для аналитики
export class EnhancedAnalyticsService extends EnhancedService {
  constructor() {
    super('analytics');
  }

  async fetchData(endpoint, params) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (endpoint) {
      case 'revenue':
        return {
          period: params.period || 'week',
          total: 485000,
          growth: 12.5,
          byDay: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 50000) + 50000,
            orders: Math.floor(Math.random() * 100) + 50
          })),
          byRestaurant: [
            { id: 1, name: "Восток", revenue: 150000, percentage: 31 },
            { id: 2, name: "Запад", revenue: 135000, percentage: 28 },
            { id: 3, name: "Север", revenue: 110000, percentage: 23 },
            { id: 4, name: "Юг", revenue: 90000, percentage: 18 }
          ],
          timestamp: new Date().toISOString()
        };

      case 'attendance':
        return {
          date: today,
          totalEmployees: 45,
          present: 38,
          absent: 7,
          late: 3,
          byRestaurant: [
            { id: 1, name: "Восток", present: 12, absent: 1, late: 0 },
            { id: 2, name: "Запад", present: 10, absent: 2, late: 1 },
            { id: 3, name: "Север", present: 8, absent: 1, late: 1 },
            { id: 4, name: "Юг", present: 8, absent: 3, late: 1 }
          ],
          timestamp: new Date().toISOString()
        };

      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }
}

// Создаем экземпляры сервисов
export const restaurantService = new EnhancedRestaurantService();
export const analyticsService = new EnhancedAnalyticsService();

export default {
  restaurantService,
  analyticsService
};