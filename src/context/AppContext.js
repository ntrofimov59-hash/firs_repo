// src/context/AppContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { mockRestaurants, mockEmployees, mockSupplies, mockReports } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция загрузки всех данных
  const loadRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      // Имитация загрузки данных
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRestaurants(mockRestaurants);
      setEmployees(mockEmployees);
      setSupplies(mockSupplies);
      setReports(mockReports);
      setError(null);
      return mockRestaurants;
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Ошибка загрузки данных');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Функция обновления данных конкретного ресторана
  const refreshRestaurantData = useCallback(async (restaurantId) => {
    try {
      // Имитация обновления данных ресторана
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Обновляем данные ресторана (в реальном приложении здесь был бы API вызов)
      const updatedRestaurants = restaurants.map(restaurant => {
        if (restaurant.id === restaurantId) {
          return {
            ...restaurant,
            currentRevenue: restaurant.currentRevenue + Math.floor(Math.random() * 10000),
            todaySales: restaurant.todaySales + Math.floor(Math.random() * 10),
            lastUpdated: new Date()
          };
        }
        return restaurant;
      });
      
      setRestaurants(updatedRestaurants);
      return updatedRestaurants.find(r => r.id === restaurantId);
    } catch (err) {
      console.error('Error refreshing restaurant data:', err);
      throw err;
    }
  }, [restaurants]);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // Функции для управления ресторанами
  const addRestaurant = (restaurantData) => {
    const newRestaurant = {
      ...restaurantData,
      id: Date.now(),
      isOpen: restaurantData.isOpen !== undefined ? restaurantData.isOpen : true,
      rating: 0,
      totalEmployees: 0,
      monthlyRevenue: 0,
      currentRevenue: 0,
      todaySales: 0,
      image: "🍽️",
      employees: [],
      supplies: []
    };
    setRestaurants(prev => [...prev, newRestaurant]);
    return newRestaurant;
  };

  const updateRestaurant = (id, updates) => {
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === id ? { ...restaurant, ...updates } : restaurant
      )
    );
  };

  const deleteRestaurant = (id) => {
    setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
    setEmployees(prev => prev.filter(employee => employee.restaurantId !== id));
    setSupplies(prev => prev.filter(supply => supply.restaurantId !== id));
  };

  // Функции для управления сотрудниками
  const addEmployee = (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: Date.now(),
      status: 'active',
      isActive: true,
      hireDate: new Date().toISOString().split('T')[0],
      image: employeeData.image || "👨‍💼"
    };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id, updates) => {
    setEmployees(prev => 
      prev.map(employee => 
        employee.id === id ? { ...employee, ...updates } : employee
      )
    );
  };

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(employee => employee.id !== id));
  };

  // Функции для управления поставками
  const addSupply = (supplyData) => {
    const newSupply = {
      ...supplyData,
      id: Date.now(),
      status: 'in_stock',
      lastDelivery: new Date().toISOString().split('T')[0]
    };
    setSupplies(prev => [...prev, newSupply]);
    return newSupply;
  };

  const updateSupply = (id, updates) => {
    setSupplies(prev => 
      prev.map(supply => 
        supply.id === id ? { ...supply, ...updates } : supply
      )
    );
  };

  const deleteSupply = (id) => {
    setSupplies(prev => prev.filter(supply => supply.id !== id));
  };

  // Получение данных по ресторану
  const getRestaurantData = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const restaurantEmployees = employees.filter(e => e.restaurantId === restaurantId);
    const restaurantSupplies = supplies.filter(s => s.restaurantId === restaurantId);
    
    return {
      restaurant,
      employees: restaurantEmployees,
      supplies: restaurantSupplies
    };
  };

  // Статистика
  const getStatistics = () => {
    return {
      totalRestaurants: restaurants.length,
      totalEmployees: employees.length,
      openRestaurants: restaurants.filter(r => r.isOpen).length,
      totalRevenue: restaurants.reduce((sum, r) => sum + (r.monthlyRevenue || 0), 0),
      activeEmployees: employees.filter(e => e.status === 'active').length
    };
  };

  const value = {
    // Данные
    restaurants,
    employees,
    supplies,
    reports,
    loading,
    error,
    
    // Функции загрузки и обновления
    loadRestaurants,
    refreshRestaurantData,
    
    // Функции для ресторанов
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    
    // Функции для сотрудников
    addEmployee,
    updateEmployee,
    deleteEmployee,
    
    // Функции для поставок
    addSupply,
    updateSupply,
    deleteSupply,
    
    // Вспомогательные функции
    getRestaurantData,
    getStatistics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;