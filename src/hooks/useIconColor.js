// src/hooks/useIconColor.js
import { useTheme } from '../context/ThemeContext';

export const useIconColor = (type = 'default') => {
  const { currentTheme, theme: themeName } = useTheme();

  // Простая и надежная логика определения цвета
  const getIconColor = () => {
    const isDarkTheme = themeName === 'dark' || 
                       currentTheme.dark === true || 
                       currentTheme.colors?.background === '#121212' ||
                       currentTheme.colors?.background === '#000000';

    // Базовые цвета для светлой и темной темы
    const baseColor = isDarkTheme ? '#FFFFFF' : '#000000';
    
    // Если запрошен специальный цвет, берем его из темы
    if (type !== 'default' && currentTheme.colors?.[type]) {
      return currentTheme.colors[type];
    }
    
    return baseColor;
  };

  return getIconColor();
};

// Альтернативная версия с дополнительными методами
export const useIconColorAdvanced = () => {
  const { currentTheme, theme: themeName } = useTheme();
  
  const isDarkTheme = themeName === 'dark' || 
                     currentTheme.dark === true || 
                     currentTheme.colors?.background === '#121212' ||
                     currentTheme.colors?.background === '#000000';

  const getIconColor = (type = 'default') => {
    const baseColor = isDarkTheme ? '#FFFFFF' : '#000000';
    
    if (type !== 'default' && currentTheme.colors?.[type]) {
      return currentTheme.colors[type];
    }
    
    return baseColor;
  };

  const getAdaptiveColor = (lightColor, darkColor) => {
    return isDarkTheme ? darkColor : lightColor;
  };

  const getThemedColor = (colorType = 'text') => {
    return currentTheme.colors?.[colorType] || 
           (isDarkTheme ? '#FFFFFF' : '#000000');
  };

  return {
    getIconColor,
    getAdaptiveColor,
    getThemedColor,
    isDarkTheme,
    currentTheme
  };
};