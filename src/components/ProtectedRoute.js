// components/ProtectedRoute.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredRestaurant,
  fallbackComponent 
}) => {
  const { hasPermission, canAccessRestaurant, user } = useAuth();

  // Проверка прав доступа
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Недостаточно прав для доступа</Text>
        <Text style={styles.subText}>
          Требуется право: {requiredPermission}
        </Text>
        <Text style={styles.subText}>
          Ваша роль: {user?.role}
        </Text>
      </View>
    );
  }

  // Проверка доступа к ресторану
  if (requiredRestaurant && !canAccessRestaurant(requiredRestaurant)) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Нет доступа к этому ресторану</Text>
        <Text style={styles.subText}>
          ID ресторана: {requiredRestaurant}
        </Text>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default ProtectedRoute;