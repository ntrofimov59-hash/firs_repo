import { Platform } from 'react-native';
import cacheManager from './cacheManager';
import errorHandler from './errorHandler';

class SyncManager {
  constructor() {
    this.pendingOperations = [];
    this.isOnline = true;
    this.syncInProgress = false;
    
    // Слушаем изменения сети
    this.setupNetworkListener();
  }

  // Настройка слушателя сети
  setupNetworkListener() {
    // В React Native можно использовать NetInfo
    // Пока используем простую имитацию
    this.checkNetworkStatus();
    
    setInterval(() => {
      this.checkNetworkStatus();
    }, 10000); // Проверка каждые 10 секунд
  }

  async checkNetworkStatus() {
    try {
      // В реальном приложении здесь будет NetInfo.fetch()
      const wasOnline = this.isOnline;
      this.isOnline = true; // Имитация всегда онлайн в демо
      
      if (!wasOnline && this.isOnline) {
        console.log('🌐 Network: Online - starting sync');
        this.processPendingOperations();
      }
    } catch (error) {
      console.warn('Network check failed:', error);
      this.isOnline = false;
    }
  }

  // Добавление операции в очередь
  async queueOperation(operation) {
    const operationWithMetadata = {
      id: this.generateId(),
      timestamp: Date.now(),
      ...operation,
      retries: 0,
      maxRetries: 3
    };

    this.pendingOperations.push(operationWithMetadata);
    
    // Сохраняем в постоянное хранилище
    await this.savePendingOperations();
    
    // Пытаемся выполнить сразу если онлайн
    if (this.isOnline) {
      this.processPendingOperations();
    }
    
    return operationWithMetadata.id;
  }

  // Обработка отложенных операций
  async processPendingOperations() {
    if (this.syncInProgress || this.pendingOperations.length === 0) {
      return;
    }

    this.syncInProgress = true;
    console.log(`🔄 Sync: Processing ${this.pendingOperations.length} pending operations`);

    const successfulOps = [];
    const failedOps = [];

    for (const operation of [...this.pendingOperations]) {
      try {
        await this.executeOperation(operation);
        successfulOps.push(operation);
        
        // Удаляем успешную операцию из очереди
        this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
        
      } catch (error) {
        console.error(`Sync failed for operation ${operation.id}:`, error);
        operation.retries++;
        failedOps.push(operation);
        
        // Если превышено количество попыток, удаляем операцию
        if (operation.retries >= operation.maxRetries) {
          this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
          errorHandler.logError(error, {
            type: 'SYNC_OPERATION_FAILED',
            operationId: operation.id,
            operationType: operation.type
          });
        }
      }
    }

    // Сохраняем обновленную очередь
    await this.savePendingOperations();

    console.log(`🔄 Sync completed: ${successfulOps.length} successful, ${failedOps.length} failed`);
    this.syncInProgress = false;

    // Уведомляем о завершении синхронизации
    this.notifySyncComplete(successfulOps, failedOps);
  }

  // Выполнение отдельной операции
  async executeOperation(operation) {
    console.log(`🔄 Executing operation: ${operation.type}`, operation);
    
    // Имитация выполнения операции
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 10% вероятность ошибки для тестирования
    if (Math.random() < 0.1) {
      throw new Error(`Operation ${operation.type} failed: Simulated error`);
    }
    
    return { success: true, operationId: operation.id };
  }

  // Сохранение очереди операций
  async savePendingOperations() {
    try {
      cacheManager.set('pending_operations', this.pendingOperations, 24 * 60 * 60 * 1000); // 24 часа
    } catch (error) {
      console.error('Failed to save pending operations:', error);
    }
  }

  // Загрузка очереди операций
  async loadPendingOperations() {
    try {
      const operations = cacheManager.get('pending_operations') || [];
      this.pendingOperations = operations;
      console.log(`📋 Loaded ${operations.length} pending operations from cache`);
    } catch (error) {
      console.error('Failed to load pending operations:', error);
      this.pendingOperations = [];
    }
  }

  // Генерация ID операции
  generateId() {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Уведомление о завершении синхронизации
  notifySyncComplete(successfulOps, failedOps) {
    // Здесь можно отправлять события или обновлять контекст
    if (successfulOps.length > 0 || failedOps.length > 0) {
      const event = new CustomEvent('syncComplete', {
        detail: { successful: successfulOps, failed: failedOps }
      });
      window.dispatchEvent(event);
    }
  }

  // Получение статуса синхронизации
  getStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.syncInProgress,
      pendingOperations: this.pendingOperations.length,
      lastSync: cacheManager.get('last_sync_timestamp')
    };
  }

  // Принудительная синхронизация
  async forceSync() {
    console.log('🔄 Force sync requested');
    return this.processPendingOperations();
  }

  // Очистка очереди операций
  async clearPendingOperations() {
    this.pendingOperations = [];
    await this.savePendingOperations();
    console.log('🧹 Cleared all pending operations');
  }
}

// Создаем глобальный экземпляр
const syncManager = new SyncManager();

// Загружаем pending operations при старте
syncManager.loadPendingOperations();

export default syncManager;