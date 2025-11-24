// src/components/Navigation/TabBarIcon.js
import React from 'react';
import { View, Text } from 'react-native';
import { 
  DashboardIcon, 
  EmployeesIcon, 
  AnalyticsIcon, 
  SettingsIcon 
} from '../IconSystem/IconLibrary';

export const TabBarIcon = ({ routeName, focused, color, size }) => {
  const iconProps = {
    size: size || 24,
    color: color,
  };

  const getIcon = () => {
    switch (routeName) {
      case 'Dashboard':
        return <DashboardIcon {...iconProps} />;
      case 'Employees':
        return <EmployeesIcon {...iconProps} />;
      case 'Analytics':
        return <AnalyticsIcon {...iconProps} />;
      case 'Settings':
        return <SettingsIcon {...iconProps} />;
      default:
        return <DashboardIcon {...iconProps} />;
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {getIcon()}
    </View>
  );
};