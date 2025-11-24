import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Настройка обработки уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.token = null;
  }

  // Запрос разрешений на уведомления
  async requestPermissions() {
    if (!Device.isDevice) {
      console.log('Уведомления работают только на реальных устройствах');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Разрешение на уведомления не предоставлено');
      return false;
    }

    // Получаем токен для push-уведомлений
    const token = await Notifications.getExpoPushTokenAsync();
    this.token = token.data;
    console.log('Push Token:', this.token);

    return true;
  }

  // Регистрация для получения уведомлений
  async registerForPushNotifications() {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return this.token;
  }

  // Локальное уведомление
  async scheduleLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Немедленное отображение
    });
  }

  // Уведомление о выручке
  async notifyRevenueUpdate(restaurantName, revenue, change) {
    const trend = change >= 0 ? '📈' : '📉';
    await this.scheduleLocalNotification(
      `${trend} Обновление выручки - ${restaurantName}`,
      `Текущая выручка: ${this.formatRevenue(revenue)} (${change >= 0 ? '+' : ''}${change}%)`,
      { type: 'revenue', restaurantName }
    );
  }

  // Уведомление о поставке
  async notifySupplyUpdate(restaurantName, product, status) {
    const icons = {
      'доставлено': '✅',
      'в пути': '🚚',
      'задержка': '⚠️',
      'отменено': '❌'
    };
    
    await this.scheduleLocalNotification(
      `${icons[status] || '📦'} Статус поставки - ${restaurantName}`,
      `${product} - ${status}`,
      { type: 'supply', restaurantName, product }
    );
  }

  // Уведомление о сотруднике
  async notifyEmployeeShift(employeeName, restaurantName, action) {
    const actions = {
      'clock-in': 'начал смену',
      'clock-out': 'закончил смену',
      'late': 'опоздал на смену'
    };
    
    await this.scheduleLocalNotification(
      '👥 Изменение смены',
      `${employeeName} ${actions[action] || action} в ${restaurantName}`,
      { type: 'employee', employeeName, restaurantName }
    );
  }

  // Уведомление о критическом событии
  async notifyCriticalEvent(restaurantName, event, description) {
    await this.scheduleLocalNotification(
      `🚨 ${event} - ${restaurantName}`,
      description,
      { type: 'critical', restaurantName, event }
    );
  }

  formatRevenue(revenue) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(revenue);
  }

  // Очистка всех уведомлений
  async clearAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync();
  }
}

export const notificationService = new NotificationService();