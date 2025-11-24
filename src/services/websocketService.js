class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.listeners = new Map();
  }

  // Подключение к WebSocket серверу
  connect(url) {
    return new Promise((resolve, reject) => {
      try {
        // В реальном приложении здесь будет подключение к WebSocket
        // this.socket = new WebSocket(url);
        
        // Для демо имитируем подключение
        console.log('WebSocket подключение к:', url);
        
        setTimeout(() => {
          this.socket = { readyState: 1 }; // Имитация открытого соединения
          this.startMockDataStream();
          resolve();
        }, 1000);

        // this.socket.onopen = () => {
        //   console.log('WebSocket подключен');
        //   this.reconnectAttempts = 0;
        //   resolve();
        // };

        // this.socket.onmessage = (event) => {
        //   this.handleMessage(JSON.parse(event.data));
        // };

        // this.socket.onclose = () => {
        //   console.log('WebSocket отключен');
        //   this.handleReconnect();
        // };

        // this.socket.onerror = (error) => {
        //   console.error('WebSocket ошибка:', error);
        //   reject(error);
        // };

      } catch (error) {
        reject(error);
      }
    });
  }

  // Переподключение при разрыве соединения
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect(process.env.EXPO_PUBLIC_WS_URL);
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  // Обработка входящих сообщений
  handleMessage(data) {
    const { type, payload } = data;
    
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        callback(payload);
      });
    }
  }

  // Подписка на события
  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  // Отписка от событий
  unsubscribe(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Отправка сообщения
  send(message) {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket не подключен');
    }
  }

  // Закрытие соединения
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Имитация потока данных для демо
  startMockDataStream() {
    // Имитация обновления выручки каждые 30 секунд
    this.revenueInterval = setInterval(() => {
      const restaurants = ['Ресторан "Восток"', 'Паста Бар', 'Бургер Хаус', 'Суши Мастер'];
      const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
      const revenueChange = Math.floor(Math.random() * 5000) - 1000; // -1000 до +4000
      
      this.handleMessage({
        type: 'REVENUE_UPDATE',
        payload: {
          restaurantName: randomRestaurant,
          revenue: 100000 + revenueChange,
          change: ((revenueChange / 100000) * 100).toFixed(1)
        }
      });
    }, 30000);

    // Имитация событий поставок
    this.supplyInterval = setInterval(() => {
      const events = [
        { product: 'Лосось', status: 'доставлено' },
        { product: 'Говядина', status: 'в пути' },
        { product: 'Овощи', status: 'задержка' }
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      this.handleMessage({
        type: 'SUPPLY_UPDATE',
        payload: {
          restaurantName: 'Ресторан "Восток"',
          ...randomEvent
        }
      });
    }, 45000);

    // Имитация событий сотрудников
    this.employeeInterval = setInterval(() => {
      const actions = ['clock-in', 'clock-out'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const employees = ['Иван Петров', 'Мария Сидорова', 'Алексей Козлов'];
      const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
      
      this.handleMessage({
        type: 'EMPLOYEE_SHIFT',
        payload: {
          employeeName: randomEmployee,
          restaurantName: 'Ресторан "Восток"',
          action: randomAction
        }
      });
    }, 60000);
  }

  stopMockDataStream() {
    if (this.revenueInterval) clearInterval(this.revenueInterval);
    if (this.supplyInterval) clearInterval(this.supplyInterval);
    if (this.employeeInterval) clearInterval(this.employeeInterval);
  }
}

export const websocketService = new WebSocketService();