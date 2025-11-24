// src/context/AuthContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Права доступа для ролей
  const ROLE_PERMISSIONS = {
    admin: [
      'all', // Полный доступ
      'manage_users',
      'manage_restaurants', 
      'view_revenue',
      'view_analytics',
      'manage_employees',
      'view_reports',
      'manage_supplies',
      'view_system_settings'
    ],
    manager: [
      'view_revenue',
      'view_analytics', 
      'manage_employees',
      'view_reports',
      'manage_supplies',
      'view_restaurant_data'
    ],
    viewer: [
      'view_reports',
      'view_analytics'
    ]
  };

  // Рестораны по умолчанию для демо-режима
  const DEMO_RESTAURANTS = {
    admin: [1, 2, 3, 4, 5], // Все рестораны
    manager: [1, 2], // Только назначенные рестораны
    viewer: [1] // Только один ресторан для просмотра
  };

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login attempt:', { username, password });
      
      // Определяем роль на основе логина
      let userRole = 'viewer';
      if (username.toLowerCase().includes('admin')) {
        userRole = 'admin';
      } else if (username.toLowerCase().includes('manager')) {
        userRole = 'manager';
      }
      
      // Простая проверка - принимаем любые непустые учетные данные для демо
      if (username && password) {
        const userData = {
          id: 1,
          username: username,
          role: userRole,
          permissions: ROLE_PERMISSIONS[userRole],
          name: username === 'demo' ? 'Demo User' : username,
          email: `${username}@restaurant.com`,
          restaurants: DEMO_RESTAURANTS[userRole]
        };
        
        console.log('Login successful:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      } else {
        throw new Error('Пожалуйста, введите имя пользователя и пароль');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const demoLogin = useCallback(async (role = 'manager') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 999,
        username: `demo_${role}`,
        role: role,
        permissions: ROLE_PERMISSIONS[role],
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: `demo_${role}@restaurant.com`,
        isDemo: true,
        restaurants: DEMO_RESTAURANTS[role]
      };
      
      console.log('Demo login successful:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Demo login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Проверка прав доступа
  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  }, [user]);

  // Проверка доступа к ресторану
  const canAccessRestaurant = useCallback((restaurantId) => {
    if (!user || !user.restaurants) return false;
    return user.restaurants.includes('all') || user.restaurants.includes(restaurantId);
  }, [user]);

  // Получение доступных ресторанов
  const getAccessibleRestaurants = useCallback(() => {
    return user?.restaurants || [];
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    demoLogin,
    logout,
    hasPermission,
    canAccessRestaurant,
    getAccessibleRestaurants
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;