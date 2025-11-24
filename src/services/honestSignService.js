import ApiService from './apiService';

class HonestSignService {
  constructor() {
    this.api = new ApiService('HONEST_SIGN');
  }

  // Маркированные товары (соки, вода и т.д.)
  async getMarkedProducts(restaurantId, startDate, endDate) {
    try {
      // return this.api.get('/products/marked', {
      //   restaurantId,
      //   startDate: startDate.toISOString().split('T')[0],
      //   endDate: endDate.toISOString().split('T')[0]
      // });
      
      // Заглушка для разработки
      console.log('HonestSignService: Using mock data');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        count: 1200,
        products: [
          { category: 'Соки', count: 400 },
          { category: 'Вода', count: 300 },
          { category: 'Молочная продукция', count: 500 }
        ],
        period: { startDate, endDate }
      };
    } catch (error) {
      console.warn('HonestSignService: Using fallback mock data due to error:', error);
      return {
        count: 1200,
        products: [],
        period: { startDate, endDate }
      };
    }
  }

  // Статистика по Честному знаку
  async getMarkingStatistics(restaurantId) {
    try {
      // return this.api.get('/statistics/marking', { restaurantId });
      
      // Заглушка для разработки
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        scannedToday: 85,
        expectedToday: 100,
        scannedWeek: 600,
        expectedWeek: 700
      };
    } catch (error) {
      console.warn('HonestSignService Statistics: Using fallback data');
      return {
        scannedToday: 85,
        expectedToday: 100,
        scannedWeek: 600,
        expectedWeek: 700
      };
    }
  }

  // Списания маркированной продукции
  async getMarkedWriteOffs(restaurantId, startDate, endDate) {
    try {
      // return this.api.get('/write-offs/marked', {
      //   restaurantId,
      //   startDate: startDate.toISOString().split('T')[0],
      //   endDate: endDate.toISOString().split('T')[0]
      // });
      
      // Заглушка для разработки
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        count: 25,
        amount: 7500,
        items: [
          { product: 'Сок апельсиновый', reason: 'Просрочка', quantity: 10 },
          { product: 'Вода минеральная', reason: 'Бой', quantity: 5 },
          { product: 'Молоко', reason: 'Просрочка', quantity: 10 }
        ]
      };
    } catch (error) {
      console.warn('HonestSignService Write-offs: Using fallback data');
      return {
        count: 25,
        amount: 7500,
        items: []
      };
    }
  }
}

export default new HonestSignService();