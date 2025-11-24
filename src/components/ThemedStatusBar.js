// src/components/ThemedStatusBar.js
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemedStatusBar = () => {
  const { isDark, currentTheme } = useTheme();
  
  // Определяем, является ли тема корпоративной
  const isCorporate = currentTheme.colors.primary === '#1E3A8A' || currentTheme.colors.primary === '#3B82F6';
  
  // Функция для определения стиля статус-бара
  const getStatusBarStyle = () => {
    if (isCorporate) {
      if (Platform.OS === 'ios') {
        // На iOS используем прозрачный статус-бар с темным текстом для светлой темы
        return {
          barStyle: currentTheme.colors.primary === '#1E3A8A' ? 'dark-content' : 'light-content',
          backgroundColor: 'transparent',
          translucent: true
        };
      } else {
        // На Android для корпоративных тем используем primary цвет
        return {
          barStyle: 'light-content',
          backgroundColor: currentTheme.colors.primary,
          translucent: false
        };
      }
    }
    
    // Для стандартных тем
    return {
      barStyle: isDark ? 'light-content' : 'dark-content',
      backgroundColor: currentTheme.colors.backgroundSecondary,
      translucent: false
    };
  };

  const statusBarConfig = getStatusBarStyle();

  return (
    <StatusBar 
      barStyle={statusBarConfig.barStyle}
      backgroundColor={statusBarConfig.backgroundColor}
      translucent={statusBarConfig.translucent}
      // Дополнительные свойства для лучшего внешнего вида
      animated={true}
      networkActivityIndicatorVisible={false}
      showHideTransition="fade"
    />
  );
};

export default ThemedStatusBar;