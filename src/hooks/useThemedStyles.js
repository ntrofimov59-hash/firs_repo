// src/hooks/useThemedStyles.js
import { useTheme } from '../context/ThemeContext';

export const useThemedStyles = (stylesCreator) => {
  const { currentTheme } = useTheme();
  
  // Расширенная проверка на существование и тип stylesCreator
  if (!stylesCreator) {
    console.warn('useThemedStyles: stylesCreator is undefined. Using empty styles object.');
    return {};
  }
  
  if (typeof stylesCreator !== 'function') {
    console.warn('useThemedStyles: stylesCreator is not a function. Using empty styles object.');
    return {};
  }
  
  try {
    const styles = stylesCreator(currentTheme);
    
    // Дополнительная проверка на валидность возвращаемых стилей
    if (!styles || typeof styles !== 'object') {
      console.warn('useThemedStyles: stylesCreator did not return a valid styles object.');
      return {};
    }
    
    return styles;
  } catch (error) {
    console.error('useThemedStyles: Error creating styles:', error);
    return {};
  }
};

// Дополнительный хук для использования стилей с fallback
export const useSafeThemedStyles = (stylesCreator, fallbackStyles = {}) => {
  try {
    return useThemedStyles(stylesCreator);
  } catch (error) {
    console.error('useSafeThemedStyles: Error using themed styles, falling back:', error);
    return fallbackStyles;
  }
};

export default useThemedStyles;