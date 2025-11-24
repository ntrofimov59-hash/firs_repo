// components/ProtectedRoute.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredPermission, requiredRestaurant }) => {
  const { hasPermission, canAccessRestaurant } = useAuth();

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <View style={styles.container}>
        <Text>Недостаточно прав для доступа</Text>
      </View>
    );
  }

  if (requiredRestaurant && !canAccessRestaurant(requiredRestaurant)) {
    return (
      <View style={styles.container}>
        <Text>Нет доступа к этому ресторану</Text>
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
  }
});

export default ProtectedRoute;