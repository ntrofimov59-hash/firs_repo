// src/styles/themes.js

export const lightTheme = {
  name: 'light',
  colors: {
    primary: '#2c3e50',
    secondary: '#3498db',
    background: '#f8f9fa',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#ecf0f1',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    textInverse: '#ffffff',
    success: '#27ae60',
    successLight: '#d4edda',
    error: '#e74c3c',
    errorLight: '#f8d7da',
    warning: '#f39c12',
    warningLight: '#fff3cd',
    info: '#3498db',
    infoLight: '#d1ecf1',
    border: '#e9ecef',
    shadowDark: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 50,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    round: 20,
  },
  typography: {
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    body: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
    small: {
      fontSize: 10,
    },
  },
  // Добавляем effects для совместимости
  effects: {
    glass: {
      background: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.9)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    blueGlass: {
      background: 'rgba(52, 152, 219, 0.1)',
      border: 'rgba(52, 152, 219, 0.2)',
      shadow: 'rgba(52, 152, 219, 0.15)',
    },
    orangeGlass: {
      background: 'rgba(243, 156, 18, 0.1)',
      border: 'rgba(243, 156, 18, 0.2)',
      shadow: 'rgba(243, 156, 18, 0.15)',
    },
  },
  // Добавляем gradients для совместимости
  gradients: {
    primary: ['#2c3e50', '#3498db'],
    secondary: ['#3498db', '#2c3e50'],
    glass: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'],
  },
};

export const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#1e1e1e',
    secondary: '#3498db',
    background: '#121212',
    backgroundSecondary: '#1e1e1e',
    backgroundTertiary: '#2d2d2d',
    text: '#ecf0f1',
    textSecondary: '#bdc3c7',
    textInverse: '#ffffff',
    success: '#27ae60',
    successLight: '#2d4a2d',
    error: '#e74c3c',
    errorLight: '#4a2d2d',
    warning: '#f39c12',
    warningLight: '#4a3d1a',
    info: '#3498db',
    infoLight: '#1a3a4a',
    border: '#333333',
    shadowDark: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 50,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    round: 20,
  },
  typography: {
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    body: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
    small: {
      fontSize: 10,
    },
  },
  // Добавляем effects для совместимости
  effects: {
    glass: {
      background: 'rgba(30, 30, 30, 0.8)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
    blueGlass: {
      background: 'rgba(52, 152, 219, 0.15)',
      border: 'rgba(52, 152, 219, 0.25)',
      shadow: 'rgba(52, 152, 219, 0.2)',
    },
    orangeGlass: {
      background: 'rgba(243, 156, 18, 0.15)',
      border: 'rgba(243, 156, 18, 0.25)',
      shadow: 'rgba(243, 156, 18, 0.2)',
    },
  },
  // Добавляем gradients для совместимости
  gradients: {
    primary: ['#1e1e1e', '#3498db'],
    secondary: ['#3498db', '#1e1e1e'],
    glass: ['rgba(30,30,30,0.8)', 'rgba(30,30,30,0.6)'],
  },
};

// НОВАЯ КОРПОРАТИВНАЯ ТЕМА (СИНЕ-ОРАНЖЕВАЯ)
export const corporateTheme = {
  name: 'corporate',
  colors: {
    // Основные корпоративные цвета
    primary: '#1E3A8A',           // Темно-синий
    secondary: '#F97316',         // Оранжевый
    primaryLight: '#3B82F6',      // Яркий синий
    secondaryLight: '#FDBA74',    // Светло-оранжевый
    
    // Фоны с прозрачными эффектами
    background: 'rgba(248, 250, 252, 0.95)',           // Стеклянный светлый
    backgroundSecondary: 'rgba(255, 255, 255, 0.85)',  // Прозрачный белый
    backgroundTertiary: 'rgba(226, 232, 240, 0.7)',    // Светло-серый прозрачный
    backgroundGlass: 'rgba(255, 255, 255, 0.15)',      // Стеклянный эффект
    backgroundDarkGlass: 'rgba(30, 58, 138, 0.2)',     // Синий стеклянный
    backgroundOrangeGlass: 'rgba(249, 115, 22, 0.12)', // Оранжевый стеклянный
    
    // Текст
    text: '#1E293B',              // Темно-синий текст
    textSecondary: '#475569',     // Серо-синий текст
    textInverse: '#FFFFFF',       // Белый текст
    textAccent: '#F97316',        // Оранжевый акцентный текст
    
    // Статусные цвета
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.15)',
    error: '#EF4444',
    errorLight: 'rgba(239, 68, 68, 0.15)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    info: '#3B82F6',
    infoLight: 'rgba(59, 130, 246, 0.15)',
    
    // Границы и тени
    border: 'rgba(226, 232, 240, 0.8)',
    borderAccent: 'rgba(59, 130, 246, 0.3)',
    shadowDark: 'rgba(30, 41, 59, 0.2)',
    shadowBlue: 'rgba(30, 58, 138, 0.15)',
    shadowOrange: 'rgba(249, 115, 22, 0.15)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 50,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    round: 24,
    extra: 30,
  },
  typography: {
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E3A8A',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#475569',
    },
    body: {
      fontSize: 14,
      color: '#1E293B',
    },
    caption: {
      fontSize: 12,
      color: '#64748B',
    },
    small: {
      fontSize: 10,
      color: '#94A3B8',
    },
    accent: {
      fontSize: 14,
      fontWeight: '600',
      color: '#F97316',
    },
  },
  // Специальные эффекты для стеклянного морфизма
  effects: {
    glass: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'rgba(255, 255, 255, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    blueGlass: {
      background: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.2)',
      shadow: 'rgba(30, 58, 138, 0.15)',
    },
    orangeGlass: {
      background: 'rgba(249, 115, 22, 0.1)',
      border: 'rgba(249, 115, 22, 0.2)',
      shadow: 'rgba(249, 115, 22, 0.15)',
    },
  },
  // Градиенты для кнопок и карточек
  gradients: {
    primary: ['#1E3A8A', '#3B82F6'],
    secondary: ['#F97316', '#FDBA74'],
    glass: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'],
  },
};

// ТЕМНАЯ ВЕРСИЯ КОРПОРАТИВНОЙ ТЕМЫ
export const corporateDarkTheme = {
  name: 'corporateDark',
  colors: {
    // Основные корпоративные цвета
    primary: '#3B82F6',           // Яркий синий
    secondary: '#F97316',         // Оранжевый
    primaryLight: '#60A5FA',      // Светло-синий
    secondaryLight: '#FDBA74',    // Светло-оранжевый
    
    // Фоны с прозрачными эффектами
    background: 'rgba(15, 23, 42, 0.95)',           // Темно-синий стеклянный
    backgroundSecondary: 'rgba(30, 41, 59, 0.85)',  // Прозрачный темный
    backgroundTertiary: 'rgba(51, 65, 85, 0.7)',    // Темно-серый прозрачный
    backgroundGlass: 'rgba(255, 255, 255, 0.08)',   // Темный стеклянный эффект
    backgroundDarkGlass: 'rgba(30, 58, 138, 0.3)',  // Темно-синий стеклянный
    backgroundOrangeGlass: 'rgba(249, 115, 22, 0.2)', // Оранжевый стеклянный
    
    // Текст
    text: '#F1F5F9',              // Светлый текст
    textSecondary: '#CBD5E1',     // Серо-голубой текст
    textInverse: '#0F172A',       // Темный текст
    textAccent: '#FDBA74',        // Светло-оранжевый акцентный текст
    
    // Статусные цвета
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.2)',
    error: '#EF4444',
    errorLight: 'rgba(239, 68, 68, 0.2)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.2)',
    info: '#60A5FA',
    infoLight: 'rgba(96, 165, 250, 0.2)',
    
    // Границы и тени
    border: 'rgba(71, 85, 105, 0.6)',
    borderAccent: 'rgba(96, 165, 250, 0.4)',
    shadowDark: 'rgba(0, 0, 0, 0.3)',
    shadowBlue: 'rgba(59, 130, 246, 0.25)',
    shadowOrange: 'rgba(249, 115, 22, 0.25)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 50,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    round: 24,
    extra: 30,
  },
  typography: {
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#F1F5F9',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#CBD5E1',
    },
    body: {
      fontSize: 14,
      color: '#F1F5F9',
    },
    caption: {
      fontSize: 12,
      color: '#94A3B8',
    },
    small: {
      fontSize: 10,
      color: '#64748B',
    },
    accent: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FDBA74',
    },
  },
  // Специальные эффекты для стеклянного морфизма
  effects: {
    glass: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.12)',
      shadow: 'rgba(0, 0, 0, 0.2)',
    },
    blueGlass: {
      background: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.25)',
      shadow: 'rgba(30, 58, 138, 0.25)',
    },
    orangeGlass: {
      background: 'rgba(249, 115, 22, 0.15)',
      border: 'rgba(249, 115, 22, 0.25)',
      shadow: 'rgba(249, 115, 22, 0.2)',
    },
  },
  // Градиенты для кнопок и карточек
  gradients: {
    primary: ['#1E40AF', '#3B82F6'],
    secondary: ['#EA580C', '#FDBA74'],
    glass: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
  },
};

// Улучшенные утилиты для создания стеклянного эффекта с fallback значениями
export const glassStyle = (theme) => {
  const effects = theme.effects || {};
  const glass = effects.glass || {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  };
  
  return {
    backgroundColor: glass.background,
    borderWidth: 1,
    borderColor: glass.border,
    borderRadius: theme.borderRadius?.lg || 16,
    shadowColor: glass.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  };
};

export const blueGlassStyle = (theme) => {
  const effects = theme.effects || {};
  const blueGlass = effects.blueGlass || {
    background: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)',
    shadow: 'rgba(30, 58, 138, 0.15)',
  };
  
  return {
    backgroundColor: blueGlass.background,
    borderWidth: 1,
    borderColor: blueGlass.border,
    borderRadius: theme.borderRadius?.lg || 16,
    shadowColor: blueGlass.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  };
};

export const orangeGlassStyle = (theme) => {
  const effects = theme.effects || {};
  const orangeGlass = effects.orangeGlass || {
    background: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.2)',
    shadow: 'rgba(249, 115, 22, 0.15)',
  };
  
  return {
    backgroundColor: orangeGlass.background,
    borderWidth: 1,
    borderColor: orangeGlass.border,
    borderRadius: theme.borderRadius?.lg || 16,
    shadowColor: orangeGlass.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  };
};

// Вспомогательная функция для безопасного доступа к свойствам темы
export const getThemeValue = (theme, path, defaultValue) => {
  try {
    const keys = path.split('.');
    let value = theme;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return defaultValue;
    }
    return value;
  } catch (error) {
    return defaultValue;
  }
};

// Утилита для определения типа темы
export const isCorporateTheme = (theme) => {
  return theme?.name?.includes('corporate') || theme?.colors?.primary === '#1E3A8A' || theme?.colors?.primary === '#3B82F6';
};