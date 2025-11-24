import { useState, useEffect, useCallback } from 'react';
import syncManager from '../utils/syncManager';

const useSync = () => {
  const [syncStatus, setSyncStatus] = useState(syncManager.getStatus());
  const [lastSync, setLastSync] = useState(null);

  // Обновление статуса синхронизации
  const updateSyncStatus = useCallback(() => {
    const status = syncManager.getStatus();
    setSyncStatus(status);
    
    if (status.lastSync) {
      setLastSync(new Date(status.lastSync));
    }
  }, []);

  // Принудительная синхронизация
  const forceSync = useCallback(async () => {
    try {
      await syncManager.forceSync();
      updateSyncStatus();
    } catch (error) {
      console.error('Force sync failed:', error);
      throw error;
    }
  }, [updateSyncStatus]);

  // Слушаем события синхронизации
  useEffect(() => {
    const handleSyncComplete = (event) => {
      console.log('🔄 Sync complete event received');
      updateSyncStatus();
    };

    // В React Native нужно использовать нативную систему событий
    // Пока используем интервал для обновления статуса
    const interval = setInterval(updateSyncStatus, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [updateSyncStatus]);

  // Загрузка начального статуса
  useEffect(() => {
    updateSyncStatus();
  }, [updateSyncStatus]);

  return {
    // Статус
    isOnline: syncStatus.isOnline,
    isSyncing: syncStatus.isSyncing,
    pendingOperations: syncStatus.pendingOperations,
    lastSync,
    
    // Действия
    forceSync,
    refreshStatus: updateSyncStatus,
    
    // Утилиты
    hasPendingOperations: syncStatus.pendingOperations > 0,
    isFullySynced: syncStatus.pendingOperations === 0 && syncStatus.isOnline
  };
};

export default useSync;