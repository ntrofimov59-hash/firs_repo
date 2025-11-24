import { Platform } from 'react-native';
// Централизованный обработчик ошибок
class ErrorHandler {
  constructor() {
    this.errorListeners = [];
    this.isDevelopment = __DEV__; // Expo автоматически устанавливает это
  }

  // Регистрация слушателей ошибок
  addErrorListener(listener) {
    this.errorListeners.push(listener);
  }

  // Обработка ошибок API
  handleApiError(error, context = '') {
    const errorInfo = {
      type: 'API_ERROR',
      message: error.message,
      context,
      timestamp: new Date().toISOString(),
      stack: this.isDevelopment ? error.stack : undefined
    };

    console.error(`🔴 API Error [${context}]:`, errorInfo);

    // Уведомляем всех слушателей
    this.errorListeners.forEach(listener => {
      try {
        listener(errorInfo);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });

    // Возвращаем пользовательское сообщение
    return this.getUserFriendlyMessage(error, context);
  }

  // Обработка ошибок валидации
  handleValidationError(field, message, value) {
    const errorInfo = {
      type: 'VALIDATION_ERROR',
      field,
      message,
      value,
      timestamp: new Date().toISOString()
    };

    console.warn(`🟡 Validation Error [${field}]:`, errorInfo);

    return {
      field,
      message,
      type: 'validation'
    };
  }

  // Обработка сетевых ошибок
  handleNetworkError(error) {
    const errorInfo = {
      type: 'NETWORK_ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    };

    console.error('🔴 Network Error:', errorInfo);

    return {
      message: 'Проблемы с подключением к интернету. Проверьте соединение и попробуйте снова.',
      type: 'network'
    };
  }

  // Пользовательские сообщения об ошибках
  getUserFriendlyMessage(error, context = '') {
    const errorMessage = error.message || 'Неизвестная ошибка';

    // Ошибки API
    if (errorMessage.includes('Network')) {
      return 'Проблемы с подключением к серверу. Проверьте интернет-соединение.';
    }

    if (errorMessage.includes('timeout')) {
      return 'Сервер не отвечает. Попробуйте позже.';
    }

    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return 'Ошибка авторизации. Пожалуйста, войдите снова.';
    }

    if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
      return 'Недостаточно прав для выполнения этого действия.';
    }

    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      return 'Запрашиваемый ресурс не найден.';
    }

    if (errorMessage.includes('500') || errorMessage.includes('Server Error')) {
      return 'Внутренняя ошибка сервера. Мы уже работаем над исправлением.';
    }

    // Контекстные сообщения
    switch (context) {
      case 'login':
        return 'Ошибка входа. Проверьте email и пароль.';
      case 'restaurant_create':
        return 'Не удалось создать ресторан. Проверьте данные и попробуйте снова.';
      case 'employee_add':
        return 'Ошибка при добавлении сотрудника.';
      case 'supply_management':
        return 'Ошибка при работе с поставками.';
      case 'iiko_integration':
        return 'Ошибка синхронизации с iiko.';
      case 'barline_integration':
        return 'Ошибка подключения к Barline.';
      case 'honestsign_integration':
        return 'Ошибка подключения к Честному знаку.';
      default:
        return 'Произошла непредвиденная ошибка. Попробуйте еще раз.';
    }
  }

  // Логирование ошибок (в продакшене можно отправлять в Sentry/LogRocket)
  logError(error, additionalInfo = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      additionalInfo,
      userAgent: navigator?.userAgent || 'React Native',
      platform: Platform?.OS || 'unknown'
    };

    // В development показываем в консоли
    if (this.isDevelopment) {
      console.error('🚨 Error Log:', logEntry);
    }

    // В production можно добавить отправку в сервис мониторинга
    // this.sendToMonitoringService(logEntry);
  }

  // Очистка ошибок (для reset состояния)
  clearErrors() {
    this.errorListeners = [];
  }
}

// Создаем глобальный экземпляр
const errorHandler = new ErrorHandler();
export default errorHandler;