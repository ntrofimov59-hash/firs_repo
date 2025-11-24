// src/screens/DemoLoginScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const DemoLoginScreen = ({ navigation }) => {
  const { currentTheme } = useTheme();
  const { demoLogin } = useApp();

  const handleDemoLogin = async (role) => {
    try {
      await demoLogin(role);
    } catch (error) {
      console.log('Demo login error:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme?.colors?.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: currentTheme?.colors?.text }]}>
          Демо-режим
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme?.colors?.textSecondary }]}>
          Выберите роль для демонстрации
        </Text>

        <TouchableOpacity
          style={[styles.demoButton, { backgroundColor: currentTheme?.colors?.primary || '#1e3c72' }]}
          onPress={() => handleDemoLogin('manager')}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>
            👨‍💼 Менеджер
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.demoButton, { backgroundColor: currentTheme?.colors?.secondary || '#2a5298' }]}
          onPress={() => handleDemoLogin('waiter')}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>
            🍽️ Официант
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.demoButton, { backgroundColor: currentTheme?.colors?.success || '#4CAF50' }]}
          onPress={() => handleDemoLogin('cook')}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>
            👨‍🍳 Повар
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, { borderColor: currentTheme?.colors?.border || '#dcdcdc' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: currentTheme?.colors?.text }]}>
            ← Назад
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  demoButton: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
  },
});

export default DemoLoginScreen;