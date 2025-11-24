import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

class ReportService {
  constructor() {
    this.formats = {
      PDF: 'pdf',
      CSV: 'csv',
      EXCEL: 'xlsx'
    };
  }

  // Генерация HTML для PDF отчета
  generateReportHTML(data, type, options = {}) {
    const { title, period, restaurants } = data;
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #7f8c8d;
          }
          .summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }
          .summary-item {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
          }
          .summary-label {
            font-size: 14px;
            color: #7f8c8d;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .table th {
            background: #2c3e50;
            color: white;
            padding: 12px;
            text-align: left;
          }
          .table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
          }
          .table tr:nth-child(even) {
            background: #f8f9fa;
          }
          .positive {
            color: #27ae60;
            font-weight: bold;
          }
          .negative {
            color: #e74c3c;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #7f8c8d;
            font-size: 12px;
          }
          .chart-placeholder {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${title}</div>
          <div class="subtitle">
            Период: ${period} | Сгенерировано: ${currentDate}
          </div>
        </div>

        ${this.generateSummarySection(data)}
        ${this.generateRestaurantsTable(data)}
        ${this.generateChartsSection(data)}
        
        <div class="footer">
          Отчет сгенерирован в Restaurant Manager App<br>
          ${currentDate}
        </div>
      </body>
      </html>
    `;
  }

  generateSummarySection(data) {
    const { totalRevenue, totalOrders, averageOrder, openRestaurants } = data.summary;
    
    return `
      <div class="summary">
        <h2>Сводка по ресторанам</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value">${this.formatRevenue(totalRevenue)}</div>
            <div class="summary-label">Общая выручка</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${totalOrders}</div>
            <div class="summary-label">Всего заказов</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${this.formatRevenue(averageOrder)}</div>
            <div class="summary-label">Средний чек</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${openRestaurants}</div>
            <div class="summary-label">Открыто ресторанов</div>
          </div>
        </div>
      </div>
    `;
  }

  generateRestaurantsTable(data) {
    const { restaurants } = data;
    
    return `
      <h2>Детали по ресторанам</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Ресторан</th>
            <th>Категория</th>
            <th>Выручка</th>
            <th>Заказы</th>
            <th>Средний чек</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          ${restaurants.map(restaurant => `
            <tr>
              <td>${restaurant.name}</td>
              <td>${restaurant.category}</td>
              <td>${this.formatRevenue(restaurant.revenue)}</td>
              <td>${restaurant.orders}</td>
              <td>${this.formatRevenue(restaurant.averageOrder)}</td>
              <td>${restaurant.isOpen ? '🟢 Открыт' : '🔴 Закрыт'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  generateChartsSection(data) {
    return `
      <div class="chart-placeholder">
        <h3>Графики и аналитика</h3>
        <p>В полной версии приложения здесь будут отображаться графики продаж и аналитика</p>
      </div>
    `;
  }

  // Генерация CSV отчета
  generateCSV(data) {
    const { restaurants, summary } = data;
    let csv = 'Ресторан,Категория,Выручка,Заказы,Средний чек,Статус\\n';
    
    restaurants.forEach(restaurant => {
      csv += `"${restaurant.name}","${restaurant.category}",${restaurant.revenue},${restaurant.orders},${restaurant.averageOrder},"${restaurant.isOpen ? 'Открыт' : 'Закрыт'}"\\n`;
    });
    
    // Добавляем итоги
    csv += `\\nИТОГО,,${summary.totalRevenue},${summary.totalOrders},${summary.averageOrder},`;
    
    return csv;
  }

  // Форматирование выручки
  formatRevenue(revenue) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(revenue);
  }

  // Экспорт в PDF
  async exportToPDF(data, options = {}) {
    try {
      const html = this.generateReportHTML(data, 'PDF', options);
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      });

      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Сохранить отчет PDF'
        });
      } else {
        await Sharing.shareAsync(uri);
      }

      return { success: true, uri };
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Экспорт в CSV
  async exportToCSV(data, options = {}) {
    try {
      const csvContent = this.generateCSV(data);
      const fileName = `report_${new Date().getTime()}.csv`;
      
      // В реальном приложении здесь будет логика сохранения файла
      console.log('CSV Content:', csvContent);
      
      // Для демонстрации просто покажем Alert
      return { 
        success: true, 
        message: 'CSV отчет готов к скачиванию',
        content: csvContent 
      };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return { success: false, error: error.message };
    }
  }

  // Генерация демо-данных для отчетов
  generateDemoReportData(type = 'daily') {
    const periods = {
      daily: 'За сегодня',
      weekly: 'За неделю',
      monthly: 'За месяц'
    };

    const restaurants = [
      {
        id: 1,
        name: 'Ресторан "Восток"',
        category: 'Азиатская кухня',
        revenue: 125430,
        orders: 45,
        averageOrder: 2787,
        isOpen: true,
        growth: 12.5
      },
      {
        id: 2,
        name: 'Паста Бар',
        category: 'Итальянская кухня',
        revenue: 98760,
        orders: 32,
        averageOrder: 3086,
        isOpen: true,
        growth: 8.2
      },
      {
        id: 3,
        name: 'Бургер Хаус',
        category: 'Фаст-фуд',
        revenue: 156780,
        orders: 67,
        averageOrder: 2340,
        isOpen: true,
        growth: 15.8
      },
      {
        id: 4,
        name: 'Суши Мастер',
        category: 'Азиатская кухня',
        revenue: 113450,
        orders: 28,
        averageOrder: 4051,
        isOpen: false,
        growth: -5.2
      }
    ];

    const totalRevenue = restaurants.reduce((sum, r) => sum + r.revenue, 0);
    const totalOrders = restaurants.reduce((sum, r) => sum + r.orders, 0);
    const averageOrder = totalRevenue / totalOrders;

    return {
      title: `Отчет по продажам - ${periods[type]}`,
      period: periods[type],
      summary: {
        totalRevenue,
        totalOrders,
        averageOrder: Math.round(averageOrder),
        openRestaurants: restaurants.filter(r => r.isOpen).length
      },
      restaurants,
      generatedAt: new Date().toISOString()
    };
  }

  // Получение доступных типов отчетов
  getAvailableReports() {
    return [
      {
        id: 'sales_daily',
        title: '📊 Ежедневный отчет по продажам',
        description: 'Подробная статистика продаж за сегодня',
        type: 'daily',
        formats: ['PDF', 'CSV']
      },
      {
        id: 'sales_weekly',
        title: '📈 Еженедельный отчет',
        description: 'Анализ продаж за неделю с графиками',
        type: 'weekly',
        formats: ['PDF', 'CSV']
      },
      {
        id: 'revenue_analysis',
        title: '💰 Анализ выручки',
        description: 'Детальный анализ доходов по ресторанам',
        type: 'monthly',
        formats: ['PDF']
      },
      {
        id: 'employee_performance',
        title: '👥 Эффективность персонала',
        description: 'Отчет по работе сотрудников',
        type: 'weekly',
        formats: ['PDF', 'CSV']
      },
      {
        id: 'supply_analysis',
        title: '🚚 Анализ поставок',
        description: 'Статистика поставок и расходов',
        type: 'monthly',
        formats: ['PDF']
      }
    ];
  }
}

export const reportService = new ReportService();