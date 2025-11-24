// App.js - исправленная навигация с обработкой ошибок
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { StatusBar, View, ActivityIndicator, Text, Platform } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DemoLoginScreen from './src/screens/DemoLoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RestaurantDetailScreen from './src/screens/RestaurantDetailScreen';
import EmployeeManagementScreen from './src/screens/EmployeeManagementScreen';
import SupplyManagementScreen from './src/screens/SupplyManagementScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import AddRestaurantScreen from './src/screens/AddRestaurantScreen';
import EditRestaurantScreen from './src/screens/EditRestaurantScreen';
import AddEmployeeScreen from './src/screens/AddEmployeeScreen';
import EditEmployeeScreen from './src/screens/EditEmployeeScreen';
import AddSupplyScreen from './src/screens/AddSupplyScreen';
import EditSupplyScreen from './src/screens/EditSupplyScreen';
import ProtectedRoute from './src/components/ProtectedRoute';
import ErrorBoundary from './src/components/ErrorBoundary';
import errorHandler from './src/utils/errorHandler';

const Stack = createStackNavigator();

// Компонент загрузки
function LoadingScreen() {
  const { currentTheme } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: currentTheme?.colors?.background || '#ffffff'
    }}>
      <ActivityIndicator size="large" color={currentTheme?.colors?.primary || '#007AFF'} />
      <Text style={{ 
        marginTop: 10, 
        color: currentTheme?.colors?.textSecondary || '#666666',
        fontSize: 16 
      }}>
        Загрузка...
      </Text>
    </View>
  );
}

// Компонент для настройки StatusBar
function ThemedStatusBar() {
  const { isDark, currentTheme } = useTheme();
  
  return (
    <StatusBar 
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={currentTheme?.colors?.background || '#ffffff'}
      translucent={Platform.OS === 'android'}
    />
  );
}

// Обертка приложения с правильными отступами
function AppContainer({ children }) {
  const { currentTheme } = useTheme();
  
  return (
    <View style={{ 
      flex: 1,
      backgroundColor: currentTheme?.colors?.background || '#ffffff',
      paddingTop: Platform.OS === 'android' ? 0 : 0
    }}>
      <ThemedStatusBar />
      {children}
    </View>
  );
}

// Основное приложение после входа
function MainApp() {
  const { currentTheme } = useTheme();
  const { user } = useAuth();

  console.log('=== MainApp Render ===');
  console.log('User:', user);
  console.log('Current Theme:', currentTheme);

  return (
    <AppContainer>
      <Stack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: currentTheme?.colors?.background || '#ffffff' }
        }}
      >
        {/* Дашборд - доступен всем ролям */}
        <Stack.Screen name="Dashboard">
          {(props) => (
            <ProtectedRoute requiredPermission="view_analytics">
              <DashboardScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Детали ресторана - доступны всем ролям */}
        <Stack.Screen name="RestaurantDetail">
          {(props) => (
            <ProtectedRoute requiredPermission="view_restaurant_data">
              <RestaurantDetailScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Управление сотрудниками - только admin и manager */}
        <Stack.Screen name="EmployeeManagement">
          {(props) => (
            <ProtectedRoute requiredPermission="manage_employees">
              <EmployeeManagementScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Управление поставками - только admin и manager */}
        <Stack.Screen name="SupplyManagement">
          {(props) => (
            <ProtectedRoute requiredPermission="manage_supplies">
              <SupplyManagementScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Аналитика - доступна всем ролям */}
        <Stack.Screen name="Analytics">
          {(props) => (
            <ProtectedRoute requiredPermission="view_analytics">
              <AnalyticsScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Профиль - доступен всем аутентифицированным пользователям */}
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* Настройки - только admin */}
        <Stack.Screen name="Settings">
          {(props) => (
            <ProtectedRoute requiredPermission="view_system_settings">
              <SettingsScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Уведомления - доступны всем ролям */}
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        {/* Отчеты - доступны всем ролям */}
        <Stack.Screen name="Reports">
          {(props) => (
            <ProtectedRoute requiredPermission="view_reports">
              <ReportsScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Добавление ресторана - только admin */}
        <Stack.Screen name="AddRestaurant">
          {(props) => (
            <ProtectedRoute requiredPermission="manage_restaurants">
              <AddRestaurantScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Редактирование ресторана - только admin */}
        <Stack.Screen name="EditRestaurant">
          {(props) => (
            <ProtectedRoute requiredPermission="manage_restaurants">
              <EditRestaurantScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Добавление сотрудника - только admin и manager */}
        <Stack.Screen name="AddEmployee">
          {(props) => (
            <ProtectedRoute requiredPermission="manage_employees">
              <AddEmployeeScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Редактирование сотрудника - только admin и manager */}
        <Stack.Screen name="EditEmployee">
          {(props) => (
            <ProtectedRoute requiredPermission="manage_employees">
              <EditEmployeeScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Добавление поставки - только admin и manager */}
        <Stack.Screen name="AddSupply">
          {(props) => (
            <ProtectedRoute requiredPermission="manage_supplies">
              <AddSupplyScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Редактирование поставки - только admin и manager */}
        <Stack.Screen name="EditSupply">
          {(props) => (
            <ProtectedRoute requiredPermission="manage_supplies">
              <EditSupplyScreen {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </AppContainer>
  );
}

// Навигатор для неаутентифицированных пользователей
function AuthNavigator() {
  const { currentTheme } = useTheme();

  console.log('=== AuthNavigator Render ===');

  return (
    <Stack.Navigator 
      screenOptions={{
        cardStyle: { backgroundColor: currentTheme?.colors?.background || '#ffffff' },
        headerStyle: {
          backgroundColor: currentTheme?.colors?.primary || '#1e3c72',
          elevation: 0,
          shadowOpacity: 0
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleStyle: {
          fontSize: 16,
        }
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DemoLogin" 
        component={DemoLoginScreen}
        options={{ 
          headerShown: true,
          title: 'Демо-режим',
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}

// Компонент для управления навигацией в зависимости от аутентификации
function AppNavigator() {
  const { isAuthenticated, loading, user } = useAuth();
  const { isDark, currentTheme } = useTheme();

  console.log('=== AppNavigator Render ===');
  console.log('Auth State:', { 
    isAuthenticated, 
    loading, 
    user: user ? `${user.username} (${user.role})` : 'null' 
  });
  console.log('Theme State:', { isDark });

  if (loading) {
    console.log('AppNavigator: Showing loading screen');
    return (
      <AppContainer>
        <LoadingScreen />
      </AppContainer>
    );
  }

  console.log(`AppNavigator: Rendering ${isAuthenticated ? 'MainApp' : 'AuthNavigator'}`);

  // Создаем безопасную тему для NavigationContainer с базовыми шрифтами
  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: currentTheme?.colors?.primary || '#007AFF',
      background: currentTheme?.colors?.background || '#ffffff',
      card: currentTheme?.colors?.backgroundSecondary || currentTheme?.colors?.background || '#f5f5f5',
      text: currentTheme?.colors?.text || '#000000',
      border: currentTheme?.colors?.border || '#dcdcdc',
      notification: currentTheme?.colors?.secondary || '#FF3B30',
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: 'bold',
      },
    }
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppContainer>
        {isAuthenticated ? (
          <MainApp />
        ) : (
          <AuthNavigator />
        )}
      </AppContainer>
    </NavigationContainer>
  );
}

// Главный компонент приложения
export default function App() {
  console.log('=== App Component Mounted ===');

  // Добавляем глобальный обработчик ошибок
  React.useEffect(() => {
    const errorListener = (errorInfo) => {
      // Здесь можно добавить показ тостов или других уведомлений
      console.log('Global error caught:', errorInfo);
    };

    errorHandler.addErrorListener(errorListener);

    return () => {
      errorHandler.clearErrors();
    };
  }, []);

  return (
    <ErrorBoundary 
      name="AppRoot"
      fallbackMessage="Критическая ошибка в приложении. Пожалуйста, перезапустите приложение."
    >
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <AppNavigator />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}