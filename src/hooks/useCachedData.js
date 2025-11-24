import { useState, useEffect, useCallback } from 'react';
import cacheManager from '../utils/cacheManager';
import errorHandler from '../utils/errorHandler';

const useCachedData = (cacheKey, fetchFunction, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 минут
    autoRefresh = false,
    refreshInterval = 30000, // 30 секунд
    enabled = true,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Основная функция загрузки данных
  const loadData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    // Проверяем кеш, если не принудительное обновление
    if (!forceRefresh) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLastUpdated(cacheManager.cache.get(cacheKey)?.timestamp || Date.now());
        return cachedData;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      
      // Сохраняем в кеш
      cacheManager.set(cacheKey, result, ttl);
      
      // Обновляем состояние
      setData(result);
      setLastUpdated(Date.now());
      
      // Вызываем колбэк успеха
      onSuccess?.(result);
      
      return result;
    } catch (err) {
      const userError = errorHandler.handleApiError(err, `cached_data_${cacheKey}`);
      setError(userError);
      
      // Вызываем колбэк ошибки
      onError?.(userError);
      
      throw userError;
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchFunction, ttl, enabled, onSuccess, onError]);

  // Автообновление
  useEffect(() => {
    if (!autoRefresh || !enabled) return;

    const interval = setInterval(() => {
      loadData(true); // Принудительное обновление
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadData, enabled]);

  // Первоначальная загрузка
  useEffect(() => {
    if (enabled) {
      loadData();
    }
  }, [loadData, enabled]);

  // Инвалидация кеша
  const invalidate = useCallback(() => {
    cacheManager.delete(cacheKey);
    setData(null);
    setLastUpdated(null);
  }, [cacheKey]);

  // Принудительное обновление
  const refresh = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    invalidate,
    isCached: !!cacheManager.get(cacheKey)
  };
};

export default useCachedData;