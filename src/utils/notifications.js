import { Alert } from 'react-native';

export class NotificationService {
  static showRevenueAlert(restaurantName, amount, change) {
    const trend = change >= 0 ? '📈' : '📉';
    Alert.alert(
      `${trend} Изменение выручки`,
      `${restaurantName}: ${this.formatRevenue(amount)} (${change >= 0 ? '+' : ''}${change}%)`,
      [{ text: 'OK' }]
    );
  }

  static showSupplyAlert(restaurantName, product, status) {
    const icons = {
      'доставлено': '✅',
      'в пути': '🚚',
      'задержка': '⚠️'
    };
    
    Alert.alert(
      `${icons[status] || '📦'} Статус поставки`,
      `${restaurantName}: ${product} - ${status}`,
      [{ text: 'OK' }]
    );
  }

  static showShiftAlert(employeeName, action) {
    const actions = {
      'clock-in': 'начал смену',
      'clock-out': 'закончил смену'
    };
    
    Alert.alert(
      '👥 Изменение смены',
      `${employeeName} ${actions[action] || action}`,
      [{ text: 'OK' }]
    );
  }

  static formatRevenue(revenue) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(revenue);
  }
}