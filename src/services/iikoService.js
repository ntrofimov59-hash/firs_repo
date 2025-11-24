import { apiService } from './apiService';

class IikoService {
  constructor() {
    this.organizationId = process.env.IIKO_ORGANIZATION_ID;
  }

  // Получение выручки в реальном времени
  async getLiveRevenue(restaurantId) {
    try {
      // В реальном приложении здесь будет вызов к API iiko
      // const data = await apiService.request(`/iiko/revenue/${restaurantId}`);
      
      // Моковые данные для демонстрации
      return this.mockLiveRevenue(restaurantId);
    } catch (error) {
      console.error('Error fetching iiko revenue:', error);
      throw error;
    }
  }

  // Получение информации о продажах
  async getSalesData(restaurantId, date = new Date()) {
    try {
      // Моковые данные
      return this.mockSalesData(restaurantId, date);
    } catch (error) {
      console.error('Error fetching iiko sales:', error);
      throw error;
    }
  }

  // Получение информации о меню и товарах
  async getMenuItems(restaurantId) {
    try {
      return this.mockMenuItems(restaurantId);
    } catch (error) {
      console.error('Error fetching iiko menu:', error);
      throw error;
    }
  }

  // Получение исторических данных для аналитики
  async getHistoricalData(restaurantId, period = 'week') {
    try {
      return this.mockHistoricalData(restaurantId, period);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  // Получение данных для сравнения ресторанов
  async getComparisonData() {
    try {
      return this.mockComparisonData();
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      throw error;
    }
  }

  // Получение данных о сотрудниках
  async getEmployeeData(restaurantId) {
    try {
      return this.mockEmployeeData(restaurantId);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      throw error;
    }
  }

  // Получение данных о поставках
  async getSupplyData(restaurantId) {
    try {
      return this.mockSupplyData(restaurantId);
    } catch (error) {
      console.error('Error fetching supply data:', error);
      throw error;
    }
  }

  // Моковые данные для демонстрации
  mockLiveRevenue(restaurantId) {
    const baseRevenues = {
      1: 125430,
      2: 98760,
      3: 156780,
      4: 113450
    };
    
    // Добавляем случайные колебания для имитации реальных данных
    const fluctuation = Math.random() * 2000 - 1000;
    return Math.max(0, baseRevenues[restaurantId] + fluctuation);
  }

  mockSalesData(restaurantId, date) {
    const salesTemplates = {
      1: { averageOrder: 2787, orderCount: 45 },
      2: { averageOrder: 3086, orderCount: 32 },
      3: { averageOrder: 2340, orderCount: 67 },
      4: { averageOrder: 4051, orderCount: 28 }
    };
    
    const template = salesTemplates[restaurantId] || salesTemplates[1];
    const fluctuation = Math.random() * 0.2 - 0.1; // ±10%
    
    return {
      totalRevenue: template.averageOrder * template.orderCount * (1 + fluctuation),
      orderCount: template.orderCount + Math.floor(Math.random() * 5 - 2),
      averageOrder: template.averageOrder * (1 + fluctuation),
      timestamp: new Date().toISOString()
    };
  }

  mockMenuItems(restaurantId) {
    const menus = {
      1: [
        { id: 1, name: 'Ролл Филадельфия', price: 450, category: 'Суши' },
        { id: 2, name: 'Удон с курицей', price: 320, category: 'Лапша' },
        { id: 3, name: 'Том Ям', price: 280, category: 'Супы' }
      ],
      2: [
        { id: 4, name: 'Карбонара', price: 380, category: 'Паста' },
        { id: 5, name: 'Маргарита', price: 450, category: 'Пицца' },
        { id: 6, name: 'Тирамису', price: 280, category: 'Десерты' }
      ],
      3: [
        { id: 7, name: 'Чизбургер', price: 220, category: 'Бургеры' },
        { id: 8, name: 'Картофель фри', price: 120, category: 'Закуски' },
        { id: 9, name: 'Кола', price: 80, category: 'Напитки' }
      ],
      4: [
        { id: 10, name: 'Ролл Калифорния', price: 380, category: 'Суши' },
        { id: 11, name: 'Сашими', price: 520, category: 'Суши' },
        { id: 12, name: 'Мисо суп', price: 180, category: 'Супы' }
      ]
    };
    
    return menus[restaurantId] || menus[1];
  }

  mockHistoricalData(restaurantId, period) {
    const baseData = {
      today: {
        revenue: Array.from({length: 24}, (_, i) => 
          Math.floor(50000 + Math.random() * 50000 * (i / 24))
        ),
        orders: Array.from({length: 24}, (_, i) => 
          Math.floor(20 + Math.random() * 60 * (i / 24))
        ),
        customers: Array.from({length: 24}, (_, i) => 
          Math.floor(15 + Math.random() * 45 * (i / 24))
        ),
        avgOrder: Array.from({length: 24}, () => 
          Math.floor(2000 + Math.random() * 1000)
        )
      },
      week: {
        revenue: Array.from({length: 7}, () => 
          Math.floor(80000 + Math.random() * 80000)
        ),
        orders: Array.from({length: 7}, () => 
          Math.floor(30 + Math.random() * 50)
        ),
        customers: Array.from({length: 7}, () => 
          Math.floor(25 + Math.random() * 40)
        ),
        avgOrder: Array.from({length: 7}, () => 
          Math.floor(2000 + Math.random() * 1500)
        )
      },
      month: {
        revenue: Array.from({length: 30}, () => 
          Math.floor(70000 + Math.random() * 90000)
        ),
        orders: Array.from({length: 30}, () => 
          Math.floor(25 + Math.random() * 55)
        ),
        customers: Array.from({length: 30}, () => 
          Math.floor(20 + Math.random() * 45)
        ),
        avgOrder: Array.from({length: 30}, () => 
          Math.floor(1800 + Math.random() * 1700)
        )
      }
    };

    return baseData[period] || baseData.week;
  }

  mockComparisonData() {
    return {
      restaurants: [
        { 
          id: 1, 
          name: 'Ресторан "Восток"', 
          revenue: 125430, 
          orders: 45, 
          growth: 12,
          category: 'Азиатская кухня',
          isOpen: true
        },
        { 
          id: 2, 
          name: 'Паста Бар', 
          revenue: 98760, 
          orders: 32, 
          growth: 8,
          category: 'Итальянская кухня',
          isOpen: true
        },
        { 
          id: 3, 
          name: 'Бургер Хаус', 
          revenue: 156780, 
          orders: 67, 
          growth: 15,
          category: 'Фаст-фуд',
          isOpen: true
        },
        { 
          id: 4, 
          name: 'Суши Мастер', 
          revenue: 113450, 
          orders: 28, 
          growth: -5,
          category: 'Азиатская кухня',
          isOpen: false
        }
      ],
      timestamp: new Date().toISOString()
    };
  }

  mockEmployeeData(restaurantId) {
    const employeeTemplates = {
      1: [
        { id: 1, name: 'Анна Иванова', position: 'Шеф-повар', isActive: true },
        { id: 2, name: 'Михаил Петров', position: 'Повар', isActive: true },
        { id: 3, name: 'Ольга Сидорова', position: 'Официант', isActive: true }
      ],
      2: [
        { id: 4, name: 'Джованни Росси', position: 'Шеф-повар', isActive: true },
        { id: 5, name: 'Мария Верди', position: 'Повар', isActive: false },
        { id: 6, name: 'Алексей Ковалев', position: 'Официант', isActive: true }
      ],
      3: [
        { id: 7, name: 'Иван Смирнов', position: 'Менеджер', isActive: true },
        { id: 8, name: 'Екатерина Волкова', position: 'Кассир', isActive: true },
        { id: 9, name: 'Павел Орлов', position: 'Повар', isActive: true }
      ],
      4: [
        { id: 10, name: 'Татьяна Никитина', position: 'Суши-мастер', isActive: true },
        { id: 11, name: 'Сергей Кузнецов', position: 'Повар', isActive: true },
        { id: 12, name: 'Надежда Федорова', position: 'Официант', isActive: false }
      ]
    };
    
    return employeeTemplates[restaurantId] || employeeTemplates[1];
  }

  mockSupplyData(restaurantId) {
    const supplyTemplates = {
      1: [
        { id: 1, product: 'Лосось', quantity: 15, unit: 'кг', status: 'в пути' },
        { id: 2, product: 'Рис', quantity: 50, unit: 'кг', status: 'доставлено' },
        { id: 3, product: 'Авокадо', quantity: 20, unit: 'кг', status: 'ожидает' }
      ],
      2: [
        { id: 4, product: 'Макароны', quantity: 30, unit: 'кг', status: 'доставлено' },
        { id: 5, product: 'Пармезан', quantity: 5, unit: 'кг', status: 'в пути' },
        { id: 6, product: 'Томаты', quantity: 25, unit: 'кг', status: 'доставлено' }
      ],
      3: [
        { id: 7, product: 'Говядина', quantity: 40, unit: 'кг', status: 'в пути' },
        { id: 8, product: 'Булочки', quantity: 200, unit: 'шт', status: 'ожидает' },
        { id: 9, product: 'Сыр', quantity: 15, unit: 'кг', status: 'доставлено' }
      ],
      4: [
        { id: 10, product: 'Тунец', quantity: 12, unit: 'кг', status: 'ожидает' },
        { id: 11, product: 'Нори', quantity: 1000, unit: 'листов', status: 'доставлено' },
        { id: 12, product: 'Имбирь', quantity: 8, unit: 'кг', status: 'в пути' }
      ]
    };
    
    return supplyTemplates[restaurantId] || supplyTemplates[1];
  }
}

export const iikoService = new IikoService();