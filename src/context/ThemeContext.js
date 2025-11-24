// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, corporateTheme } from '../styles/themes';

const ThemeContext = createContext();

const STORAGE_KEY = 'app_theme_preference';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'corporate', 'system'
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка сохраненной темы при монтировании
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Сохранение темы при изменении
  const saveTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Определяем текущую активную тему
  const activeTheme = useMemo(() => {
    if (theme === 'system') {
      return systemColorScheme || 'light';
    }
    return theme;
  }, [theme, systemColorScheme]);

  // Получаем объект темы на основе текущей темы
  const currentTheme = useMemo(() => {
    switch (activeTheme) {
      case 'dark':
        return darkTheme;
      case 'corporate':
        return corporateTheme;
      case 'light':
      default:
        return lightTheme;
    }
  }, [activeTheme]);

  // Функция для изменения темы
  const changeTheme = (newTheme) => {
    if (!['light', 'dark', 'corporate', 'system'].includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}. Using 'light' as fallback.`);
      newTheme = 'light';
    }
    
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  // Переключение между светлой и темной темой
  const toggleTheme = () => {
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    changeTheme(nextTheme);
  };

  // Циклическое переключение между всеми темами
  const cycleThemes = () => {
    const themes = ['light', 'dark', 'corporate', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex]);
  };

  // Получение человекочитаемого названия темы
  const getThemeDisplayName = () => {
    switch (theme) {
      case 'light':
        return 'Светлая';
      case 'dark':
        return 'Тёмная';
      case 'corporate':
        return 'Корпоративная';
      case 'system':
        return `Системная (${systemColorScheme === 'dark' ? 'Тёмная' : 'Светлая'})`;
      default:
        return 'Светлая';
    }
  };

  const value = {
    // Текущие настройки темы
    theme, // Выбранная тема (включая 'system')
    activeTheme, // Активная тема (без 'system')
    currentTheme, // Объект темы с цветами
    isDark: activeTheme === 'dark',
    isSystem: theme === 'system',
    
    // Состояние загрузки
    isLoaded,
    
    // Функции управления
    changeTheme,
    toggleTheme,
    cycleThemes,
    getThemeDisplayName,
    
    // Системная информация
    systemColorScheme,
  };

  // Не рендерим детей пока тема не загружена (опционально)
  if (!isLoaded) {
    return null; // Или loading indicator
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;