class ExportService {
  // Генерация текстового отчета
  generateTextReport = (data) => {
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    let content = `🍽️ АНАЛИТИЧЕСКИЙ ОТЧЕТ РЕСТОРАНОВ\n`;
    content += `========================================\n`;
    content += `Сгенерировано: ${currentDate}\n\n`;

    // Сводная статистика
    const totalRevenue = data.restaurants?.reduce((sum, r) => sum + (r.currentRevenue || 0), 0) || 0;
    const totalOrders = data.restaurants?.reduce((sum, r) => sum + (r.todaySales || 0), 0) || 0;
    const openRestaurants = data.restaurants?.filter(r => r.isOpen).length || 0;
    const totalRestaurants = data.restaurants?.length || 0;

    content += `📊 СВОДНАЯ СТАТИСТИКА\n`;
    content += `===================\n`;
    content += `💰 Общая выручка: ${this.formatCurrency(totalRevenue)}\n`;
    content += `📦 Всего заказов: ${totalOrders}\n`;
    content += `🏪 Открыто ресторанов: ${openRestaurants} из ${totalRestaurants}\n`;
    content += `🧾 Средний чек: ${this.formatCurrency(Math.round(totalRevenue / (totalOrders || 1)))}\n\n`;

    // Выручка по месяцам
    if (data.revenue && data.revenue.length > 0) {
      content += `💰 ВЫРУЧКА ПО МЕСЯЦАМ\n`;
      content += `====================\n`;
      data.revenue.forEach(item => {
        content += `📅 ${item.month}: ${this.formatCurrency(item.revenue)} (${(item.revenue / 1000000).toFixed(2)} млн)\n`;
      });
      content += `\n`;
    }

    // Производительность ресторанов
    if (data.performance && data.performance.length > 0) {
      content += `🏆 ПРОИЗВОДИТЕЛЬНОСТЬ РЕСТОРАНОВ\n`;
      content += `==============================\n`;
      data.performance.forEach(item => {
        content += `🍴 ${item.name}\n`;
        content += `   💰 Выручка: ${this.formatCurrency(item.revenue)}\n`;
        content += `   📦 Заказов: ${item.orders}\n`;
        content += `   🧾 Средний чек: ${this.formatCurrency(Math.round(item.revenue / item.orders))}\n\n`;
      });
    }

    // Популярные блюда
    if (data.dishes && data.dishes.length > 0) {
      content += `🍽️ ПОПУЛЯРНЫЕ БЛЮДА\n`;
      content += `===================\n`;
      data.dishes.forEach((item, index) => {
        content += `${index + 1}. ${item.name}: ${item.orders} заказов\n`;
      });
      content += `\n`;
    }

    // Статистика ресторанов
    if (data.restaurants && data.restaurants.length > 0) {
      content += `🏪 СТАТИСТИКА РЕСТОРАНОВ\n`;
      content += `=======================\n`;
      data.restaurants.forEach(item => {
        content += `📋 ${item.name}\n`;
        content += `   📊 Статус: ${item.isOpen ? '🟢 Открыт' : '🔴 Закрыт'}\n`;
        content += `   💰 Выручка сегодня: ${this.formatCurrency(item.currentRevenue)}\n`;
        content += `   📦 Заказов сегодня: ${item.todaySales}\n`;
        content += `   👥 Сотрудников: ${item.totalEmployees}\n`;
        content += `   ⭐ Рейтинг: ${item.rating}\n\n`;
      });
    }

    content += `========================================\n`;
    content += `Отчет сгенерирован в Restaurant Manager\n`;

    return content;
  };

  // Генерация CSV отчета
  generateCSVReport = (data) => {
    let csvContent = '';
    
    // Сводная статистика
    const totalRevenue = data.restaurants?.reduce((sum, r) => sum + (r.currentRevenue || 0), 0) || 0;
    const totalOrders = data.restaurants?.reduce((sum, r) => sum + (r.todaySales || 0), 0) || 0;
    
    csvContent += 'Метрика,Значение\n';
    csvContent += `Общая выручка,${totalRevenue}\n`;
    csvContent += `Всего заказов,${totalOrders}\n`;
    csvContent += `Дата генерации,${new Date().toLocaleString('ru-RU')}\n\n`;

    // Выручка по месяцам
    if (data.revenue && data.revenue.length > 0) {
      csvContent += 'Выручка по месяцам\n';
      csvContent += 'Месяц,Выручка,Выручка (млн)\n';
      data.revenue.forEach(item => {
        csvContent += `${item.month},${item.revenue},${(item.revenue / 1000000).toFixed(2)}\n`;
      });
      csvContent += '\n';
    }

    // Производительность ресторанов
    if (data.performance && data.performance.length > 0) {
      csvContent += 'Производительность ресторанов\n';
      csvContent += 'Ресторан,Выручка,Заказы,Средний чек\n';
      data.performance.forEach(item => {
        csvContent += `${item.name},${item.revenue},${item.orders},${Math.round(item.revenue / item.orders)}\n`;
      });
      csvContent += '\n';
    }

    // Популярные блюда
    if (data.dishes && data.dishes.length > 0) {
      csvContent += 'Популярные блюда\n';
      csvContent += 'Блюдо,Заказы\n';
      data.dishes.forEach(item => {
        csvContent += `${item.name},${item.orders}\n`;
      });
    }

    return csvContent;
  };

  // Генерация JSON данных (для разработчиков)
  generateJSONReport = (data) => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue: data.restaurants?.reduce((sum, r) => sum + (r.currentRevenue || 0), 0) || 0,
        totalOrders: data.restaurants?.reduce((sum, r) => sum + (r.todaySales || 0), 0) || 0,
        openRestaurants: data.restaurants?.filter(r => r.isOpen).length || 0,
        totalRestaurants: data.restaurants?.length || 0,
      },
      revenue: data.revenue || [],
      performance: data.performance || [],
      dishes: data.dishes || [],
      restaurants: data.restaurants || []
    };

    return JSON.stringify(report, null, 2);
  };

  // Вспомогательные функции
  formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Получение всех доступных форматов экспорта
  getExportFormats = () => [
    {
      id: 'text',
      name: 'Текстовый отчет',
      description: 'Человеко-читаемый формат с эмодзи',
      emoji: '📄',
      color: '#3498DB'
    },
    {
      id: 'csv', 
      name: 'CSV данные',
      description: 'Табличный формат для Excel',
      emoji: '📊',
      color: '#27AE60'
    },
    {
      id: 'json',
      name: 'JSON данные',
      description: 'Структурированный формат для разработчиков',
      emoji: '🔧',
      color: '#E67E22'
    }
  ];
}

export default new ExportService();