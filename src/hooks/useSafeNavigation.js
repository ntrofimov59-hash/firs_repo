// src/hooks/useSafeNavigation.js
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export const useSafeNavigation = () => {
  const navigation = useNavigation();

  const safeNavigate = useCallback((routeName, params) => {
    if (navigation && navigation.navigate) {
      navigation.navigate(routeName, params);
    } else {
      console.warn('Navigation not available');
    }
  }, [navigation]);

  return {
    navigate: safeNavigate,
    goBack: navigation?.goBack,
    canGoBack: navigation?.canGoBack,
    // Добавьте другие методы навигации по необходимости
  };
};