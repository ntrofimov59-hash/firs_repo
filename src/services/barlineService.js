import ApiService from './apiService';

class BarlineService {
  constructor() {
    this.api = new ApiService('BARLINE');
  }

  // Списания алкогольной продукции
  async getAlcoholWriteOffs(restaurantId, startDate, endDate) {
    try {
      // Закомментируем реальный запрос пока не настроено API
      // return this.api.get('/write-offs/alcohol', {
      //   restaurantId,
      //   startDate: startDate.toISOString().split('T')[0],
      //   endDate: endDate.toISOString().split('T')[0]
      // });
      
      // Заглушка для разработки
      console.log('BarlineService: Using mock data');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
      
      return {
        total: 15000,
        today: 3000,
        period: { startDate, endDate },
        items: [
          { product: 'Вино красное', amount: 5000, quantity: 5 },
          { product: 'Вино белое', amount: 4500, quantity: 4 },
          { product: 'Пиво', amount: 5500, quantity: 10 }
        ]
      };
    } catch (error) {
      console.warn('BarlineService: Using fallback mock data due to error:', error);
      // Возвращаем данные даже при ошибке
      return {
        total: 15000,
        today: 3000,
        period: { startDate, endDate },
        items: []
      };
    }
  }

  // Отчеты ЕГАИС
  async getEgaisReports(restaurantId, period) {
    try {
      // return this.api.get('/reports/egais', {
      //   restaurantId,
      //   period
      // });
      
      // Заглушка для разработки
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        totalVolume: 150,
        totalCost: 50000,
        reports: [
          { type: 'Поступление', count: 15, date: new Date().toISOString() },
          { type: 'Реализация', count: 12, date: new Date().toISOString() },
          { type: 'Списание', count: 3, date: new Date().toISOString() }
        ]
      };
    } catch (error) {
      console.warn('BarlineService EGAIS: Using fallback data');
      return {
        totalVolume: 150,
        totalCost: 50000,
        reports: []
      };
    }
  }

  // Остатки алкоголя
  async getAlcoholBalance(restaurantId) {
    try {
      // return this.api.get('/balance/alcohol', { restaurantId });
      
      // Заглушка для разработки
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        totalItems: 45,
        criticalItems: 2,
        items: [
          { product: 'Вино красное', balance: 15, minStock: 10, status: 'normal' },
          { product: 'Вино белое', balance: 8, minStock: 10, status: 'low' },
          { product: 'Пиво', balance: 20, minStock: 15, status: 'normal' },
          { product: 'Водка', balance: 5, minStock: 10, status: 'critical' }
        ]
      };
    } catch (error) {
      console.warn('BarlineService Balance: Using fallback data');
      return {
        totalItems: 45,
        criticalItems: 2,
        items: []
      };
    }
  }
}

export default new BarlineService();