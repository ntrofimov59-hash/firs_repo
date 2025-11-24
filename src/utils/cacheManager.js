// Менеджер кеширования данных для оффлайн работы
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 минут по умолчанию
  }

  // Сохранение данных в кеш
  set(key, data, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, {
      data,
      expiry,
      timestamp: Date.now()
    });
    
    console.log(`💾 Cache set: ${key}, expiry: ${new Date(expiry).toLocaleTimeString()}`);
  }

  // Получение данных из кеша
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      console.log(`💾 Cache miss: ${key}`);
      return null;
    }

    // Проверка срока годности
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      console.log(`💾 Cache expired: ${key}`);
      return null;
    }

    console.log(`💾 Cache hit: ${key}`);
    return item.data;
  }

  // Удаление данных из кеша
  delete(key) {
    this.cache.delete(key);
    console.log(`💾 Cache deleted: ${key}`);
  }

  // Очистка просроченных данных
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    
    console.log(`💾 Cache cleanup: removed ${cleanedCount} expired items`);
    return cleanedCount;
  }

  // Получение статистики кеша
  getStats() {
    const now = Date.now();
    const stats = {
      total: this.cache.size,
      valid: 0,
      expired: 0,
      memoryUsage: this.getMemoryUsage()
    };

    for (const item of this.cache.values()) {
      if (now > item.expiry) {
        stats.expired++;
      } else {
        stats.valid++;
      }
    }

    return stats;
  }

  // Оценка использования памяти
  getMemoryUsage() {
    const data = JSON.stringify(Array.from(this.cache.entries()));
    return new Blob([data]).size;
  }

  // Групповые операции
  setMultiple(items) {
    Object.entries(items).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  getMultiple(keys) {
    const results = {};
    keys.forEach(key => {
      results[key] = this.get(key);
    });
    return results;
  }

  // Префиксные операции (удобно для очистки по группам)
  deleteByPrefix(prefix) {
    let deletedCount = 0;
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    console.log(`💾 Deleted ${deletedCount} items with prefix: ${prefix}`);
    return deletedCount;
  }
}

// Создаем глобальный экземпляр
const cacheManager = new CacheManager();

// Автоматическая очистка каждые 10 минут
setInterval(() => {
  cacheManager.cleanup();
}, 10 * 60 * 1000);

export default cacheManager;