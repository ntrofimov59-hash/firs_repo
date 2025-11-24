// src/screens/CacheManagementScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import cacheManager from '../utils/cacheManager';
import syncManager from '../utils/syncManager';
import ActionButton from '../components/ActionButton';
import BackButton from '../components/BackButton';
import { useThemedStyles } from '../hooks/useThemedStyles';

const CacheManagementScreen = () => {
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const themedStyles = useThemedStyles(staticStyles);
  const [cacheStats, setCacheStats] = useState({});
  const [syncStatus, setSyncStatus] = useState({});

  // Настройка заголовка с кнопкой назад
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton 
          onPress={() => navigation.goBack()}
          style={themedStyles.backButton}
        />
      ),
    });
  }, [navigation]);

  const loadStats = () => {
    setCacheStats(cacheManager.getStats());
    setSyncStatus(syncManager.getStatus());
  };

  useEffect(() => {
    loadStats();
    
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    Alert.alert(
      'Очистка кеша',
      'Вы уверены, что хотите очистить весь кеш? Это может временно замедлить работу приложения.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить', 
          style: 'destructive',
          onPress: () => {
            cacheManager.cleanup();
            loadStats();
          }
        }
      ]
    );
  };

  const handleForceSync = async () => {
    try {
      await syncManager.forceSync();
      loadStats();
      Alert.alert('Успех', 'Синхронизация запущена');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось запустить синхронизацию');
    }
  };

  const handleClearPending = () => {
    Alert.alert(
      'Очистка очереди',
      'Очистить все отложенные операции?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить', 
          style: 'destructive',
          onPress: async () => {
            await syncManager.clearPendingOperations();
            loadStats();
          }
        }
      ]
    );
  };

  const StatusIndicator = ({ online, syncing }) => (
    <View style={themedStyles.statusIndicator}>
      <View style={[
        themedStyles.statusDot, 
        { backgroundColor: online ? currentTheme.colors.success : currentTheme.colors.error }
      ]} />
      <Text style={themedStyles.statusText}>
        {online ? 'Онлайн' : 'Оффлайн'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={themedStyles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={themedStyles.scrollView}>
        <View style={themedStyles.header}>
          <Text style={themedStyles.title}>
            Управление кешем
          </Text>
        </View>

        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>
            Статистика кеша
          </Text>
          
          <View style={themedStyles.statsGrid}>
            <View style={themedStyles.statCard}>
              <Text style={themedStyles.statValue}>
                {cacheStats.total || 0}
              </Text>
              <Text style={themedStyles.statLabel}>
                Всего записей
              </Text>
            </View>
            
            <View style={themedStyles.statCard}>
              <Text style={[themedStyles.statValue, { color: currentTheme.colors.success }]}>
                {cacheStats.valid || 0}
              </Text>
              <Text style={themedStyles.statLabel}>
                Активных
              </Text>
            </View>
            
            <View style={themedStyles.statCard}>
              <Text style={[themedStyles.statValue, { color: currentTheme.colors.warning }]}>
                {cacheStats.expired || 0}
              </Text>
              <Text style={themedStyles.statLabel}>
                Просроченных
              </Text>
            </View>
          </View>

          <Text style={themedStyles.memoryUsage}>
            Использование памяти: {(cacheStats.memoryUsage / 1024).toFixed(2)} KB
          </Text>
        </View>

        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>
            Синхронизация
          </Text>
          
          <View style={themedStyles.statusCard}>
            <StatusIndicator 
              online={syncStatus.isOnline} 
              syncing={syncStatus.isSyncing} 
            />
            <View style={themedStyles.statusRow}>
              <Text style={themedStyles.statusText}>
                Синхронизация: {syncStatus.isSyncing ? 'В процессе' : 'Не активна'}
              </Text>
            </View>
            <View style={themedStyles.statusRow}>
              <Text style={themedStyles.statusText}>
                Очередь: {syncStatus.pendingOperations || 0} операций
              </Text>
            </View>
          </View>
        </View>

        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>
            Управление
          </Text>
          
          <ActionButton
            onPress={handleClearCache}
            iconName="trash"
            label="Очистить кеш"
            variant="warning"
            size="large"
            fullWidth
            style={themedStyles.managementButton}
          />
          
          <ActionButton
            onPress={handleForceSync}
            iconName="refresh"
            label="Принудительная синхронизация"
            variant="primary"
            size="large"
            fullWidth
            style={themedStyles.managementButton}
          />
          
          <ActionButton
            onPress={handleClearPending}
            iconName="close"
            label="Очистить очередь"
            variant="danger"
            size="large"
            fullWidth
            style={themedStyles.managementButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const staticStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background || theme.background,
  },
  scrollView: {
    flex: 1,
    padding: 20
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors?.text || theme.text,
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors?.text || theme.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: theme.colors?.backgroundSecondary || 'rgba(0,0,0,0.05)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 4,
    color: theme.colors?.text || theme.text,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: theme.colors?.textSecondary || '#666666',
  },
  memoryUsage: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors?.textSecondary || '#666666',
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors?.backgroundSecondary || 'rgba(0,0,0,0.05)',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: theme.colors?.text || theme.text,
  },
  managementButton: {
    marginBottom: 12,
  },
  backButton: {
    marginLeft: 8,
  },
});

export default CacheManagementScreen;