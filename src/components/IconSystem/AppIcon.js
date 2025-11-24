// src/components/IconSystem/AppIcon.js
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export const IconColors = {
  primary: '#FF8C00',
  secondary: '#2A5298',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  dark: '#2C3E50',
  light: '#ECF0F1',
  white: '#FFFFFF',
  muted: '#7F8C8D',
};

export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

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

  return renderIcon();
};

export default AppIcon;