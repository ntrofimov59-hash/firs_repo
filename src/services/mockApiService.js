// Сервис для тестовых API endpoints с реалистичными ответами
class MockApiService {
  constructor() {
    this.baseURL = 'https://mockapi.restaurantmanager.com/api';
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  }

  // Имитация сетевого запроса
  async request(endpoint, options = {}) {
    // Случайная задержка для реалистичности (0.5-2 секунды)
    await this.delay(500 + Math.random() * 1500);
    
    // 10% вероятность ошибки для тестирования
    if (Math.random() < 0.1) {
      throw new Error(`Mock API Error: ${endpoint} - Network timeout`);
    }

    const url = `${this.baseURL}${endpoint}`;
    console.log(`Mock API Request: ${url}`, options);
    
    return this.mockResponses[endpoint] ? this.mockResponses[endpoint]() : { data: null };
  }

  // Тестовые данные для всех endpoints
  mockResponses = {
    // IIKO endpoints
    '/iiko/attendance': () => ({
      data: {
        date: new Date().toISOString(),
        totalEmployees: 45,
        present: 38,
        absent: 7,
        late: 3,
        details: [
          { restaurantId: 1, name: "Ресторан Восток", present: 12, absent: 1 },
          { restaurantId: 2, name: "Ресторан Запад", present: 10, absent: 2 },
          { restaurantId: 3, name: "Ресторан Север", present: 8, absent: 1 },
          { restaurantId: 4, name: "Ресторан Юг", present: 8, absent: 3 }
        ]
      },
      timestamp: new Date().toISOString()
    }),

    '/iiko/revenue': () => ({
      data: {
        period: 'today',
        totalRevenue: 485000,
        averagePerRestaurant: 121250,
        byRestaurant: [
          { id: 1, name: "Ресторан Восток", revenue: 150000, growth: 12.5 },
          { id: 2, name: "Ресторан Запад", revenue: 135000, growth: 8.2 },
          { id: 3, name: "Ресторан Север", revenue: 110000, growth: -3.1 },
          { id: 4, name: "Ресторан Юг", revenue: 90000, growth: 5.7 }
        ]
      }
    }),

    // Barline endpoints
    '/barline/writeoffs': () => ({
      data: {
        today: 3250,
        week: 15450,
        month: 58700,
        criticalItems: 3,
        items: [
          { product: "Вино красное", amount: 5200, date: new Date().toISOString() },
          { product: "Вино белое", amount: 4800, date: new Date().toISOString() },
          { product: "Пиво", amount: 5450, date: new Date().toISOString() }
        ]
      }
    }),

    '/barline/balance': () => ({
      data: {
        totalItems: 42,
        criticalItems: 3,
        items: [
          { product: "Вино красное", balance: 12, minStock: 10, status: "normal" },
          { product: "Вино белое", balance: 7, minStock: 10, status: "low" },
          { product: "Водка", balance: 4, minStock: 10, status: "critical" }
        ]
      }
    }),

    // Честный знак endpoints
    '/honestsign/products': () => ({
      data: {
        total: 1245,
        scannedToday: 87,
        complianceRate: 87,
        byCategory: [
          { category: "Соки", count: 415 },
          { category: "Вода", count: 298 },
          { category: "Молочная продукция", count: 532 }
        ]
      }
    }),

    '/honestsign/statistics': () => ({
      data: {
        scannedToday: 87,
        expectedToday: 100,
        complianceRate: 87,
        writeOffs: 28
      }
    })
  };

  // Методы API
  async getIikoAttendance(restaurantId = 'all') {
    return this.request('/iiko/attendance', { restaurantId });
  }

  async getIikoRevenue(restaurantId = 'all', period = 'today') {
    return this.request('/iiko/revenue', { restaurantId, period });
  }

  async getBarlineWriteOffs(restaurantId = 'all', period = 'week') {
    return this.request('/barline/writeoffs', { restaurantId, period });
  }

  async getBarlineBalance(restaurantId = 'all') {
    return this.request('/barline/balance', { restaurantId });
  }

  async getHonestSignProducts(restaurantId = 'all') {
    return this.request('/honestsign/products', { restaurantId });
  }

  async getHonestSignStatistics(restaurantId = 'all') {
    return this.request('/honestsign/statistics', { restaurantId });
  }
}

export default new MockApiService();