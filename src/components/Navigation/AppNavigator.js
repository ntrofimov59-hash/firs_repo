import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  DashboardIcon, 
  EmployeesIcon, 
  AnalyticsIcon, 
  SettingsIcon,
  SupplyIcon 
} from '../components/IconSystem';

// Импорт экранов
import DashboardScreen from '../screens/DashboardScreen';
import EmployeeManagementScreen from '../screens/EmployeeManagementScreen';
import SupplyManagementScreen from '../screens/SupplyManagementScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack навигаторы с ВКЛЮЧЕННЫМИ стандартными хедерами
const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="DashboardMain" 
      component={DashboardScreen}
      options={{ 
        title: 'Главная',
        headerShown: false // Скрываем стандартный хедер, т.к. используем кастомный
      }}
    />
  </Stack.Navigator>
);

const EmployeesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="EmployeesMain" 
      component={EmployeeManagementScreen}
      options={{ 
        title: 'Сотрудники',
        headerShown: false
      }}
    />
  </Stack.Navigator>
);

const SuppliesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SuppliesMain" 
      component={SupplyManagementScreen}
      options={{ 
        title: 'Поставки',
        headerShown: false
      }}
    />
  </Stack.Navigator>
);

const AnalyticsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="AnalyticsMain" 
      component={AnalyticsScreen}
      options={{ 
        title: 'Аналитика',
        headerShown: false
      }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SettingsMain" 
      component={SettingsScreen}
      options={{ 
        title: 'Настройки',
        headerShown: false
      }}
    />
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ 
        title: 'Профиль',
        headerShown: false
      }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Скрываем хедер у табов, т.к. используем кастомные
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Dashboard') {
            return <DashboardIcon size={size} color={color} />;
          } else if (route.name === 'Employees') {
            return <EmployeesIcon size={size} color={color} />;
          } else if (route.name === 'Supplies') {
            return <SupplyIcon size={size} color={color} />;
          } else if (route.name === 'Analytics') {
            return <AnalyticsIcon size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <SettingsIcon size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Employees" component={EmployeesStack} />
      <Tab.Screen name="Supplies" component={SuppliesStack} />
      <Tab.Screen name="Analytics" component={AnalyticsStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default AppNavigator;