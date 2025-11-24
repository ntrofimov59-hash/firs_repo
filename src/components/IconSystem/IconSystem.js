// src/components/IconSystem/IconSystem.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// Конфигурация цветовой палитры
export const IconColors = {
  primary: '#FF8C00',    // Оранжевый бренда
  secondary: '#2A5298',  // Синий
  success: '#28A745',    // Зеленый
  warning: '#FFC107',    // Желтый
  error: '#DC3545',      // Красный
  dark: '#2C3E50',       // Темно-серый
  light: '#ECF0F1',      // Светло-серый
  white: '#FFFFFF',
  muted: '#7F8C8D',      // Приглушенный
};

// Размеры иконок
export const IconSizes = {
  xs: 16,    // Мелкий текст
  sm: 20,    // Подписи
  md: 24,    // Стандартный
  lg: 32,    // Заголовки
  xl: 48,    // Крупные элементы
};

// Основной компонент иконки
const AppIcon = ({ 
  name, 
  size = 'md', 
  color = 'dark', 
  library = 'Ionicons',
  style,
  ...props 
}) => {
  const iconSize = typeof size === 'string' ? IconSizes[size] : size;
  const iconColor = typeof color === 'string' ? IconColors[color] : color;

  const renderIcon = () => {
    const iconProps = {
      size: iconSize,
      color: iconColor,
      ...props,
    };

    switch (library) {
      case 'MaterialIcons':
        return <MaterialIcons name={name} {...iconProps} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name} {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={name} {...iconProps} />;
      case 'Ionicons':
      default:
        return <Ionicons name={name} {...iconProps} />;
    }
  };

  return <View style={style}>{renderIcon()}</View>;
};

// Специализированные компоненты для конкретных use cases
export const IconButton = ({ 
  icon, 
  onPress, 
  size = 'md', 
  color = 'primary',
  disabled = false,
  style,
  ...props 
}) => (
  <TouchableOpacity 
    onPress={onPress} 
    disabled={disabled}
    style={[styles.iconButton, style]}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <AppIcon {...icon} size={size} color={disabled ? 'muted' : color} {...props} />
  </TouchableOpacity>
);

const styles = {
  iconButton: {
    padding: 4,
    borderRadius: 8,
  },
};

export default AppIcon;