// src/components/IntegrationWidgetsContainer.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import BarlineWidget from './BarlineWidget';
import HonestSignWidget from './HonestSignWidget';

const IntegrationWidgetsContainer = ({ 
  onBarlinePress, 
  onHonestSignPress,
  compact = false,
  autoRefresh = true 
}) => {
  const { hasPermission } = useAuth();
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [widgetsState, setWidgetsState] = useState({
    barline: { data: null, error: null, loading: false },
    honestSign: { data: null, error: null, loading: false }
  });

  // Функция для обновления всех виджетов
  const refreshAllWidgets = useCallback(async () => {
    if (!hasPermission('view_reports')) return;

    setLoading(true);
    setRefreshing(true);

    try {
      // Сбрасываем ошибки перед обновлением
      setWidgetsState(prev => ({
        barline: { ...prev.barline, error: null, loading: true },
        honestSign: { ...prev.honestSign, error: null, loading: true }
      }));

      // Здесь можно добавить параллельную загрузку данных для всех виджетов
      // если нужно синхронизировать данные между ними
      
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Integration widgets refresh error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Сбрасываем состояния загрузки для виджетов
      setTimeout(() => {
        setWidgetsState(prev => ({
          barline: { ...prev.barline, loading: false },
          honestSign: { ...prev.honestSign, loading: false }
        }));
      }, 1000);
    }
  }, [hasPermission]);

  // Обработчики для дочерних виджетов
  const handleBarlineDataUpdate = useCallback((data, error) => {
    setWidgetsState(prev => ({
      ...prev,
      barline: { 
        data, 
        error, 
        loading: false,
        lastUpdate: new Date()
      }
    }));
  }, []);

  const handleHonestSignDataUpdate = useCallback((data, error) => {
    setWidgetsState(prev => ({
      ...prev,
      honestSign: { 
        data, 
        error, 
        loading: false,
        lastUpdate: new Date()
      }
    }));
  }, []);

  // Автообновление
  useEffect(() => {
    if (autoRefresh) {
      refreshAllWidgets();
      
      const interval = setInterval(refreshAllWidgets, 300000); // 5 минут
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshAllWidgets]);

  const colors = currentTheme?.colors || {};

  // Если нет прав доступа, не показываем контейнер
  if (!hasPermission('view_reports')) {
    return null;
  }

  // Если compact режим, показываем только виджеты без заголовка и скролла
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <BarlineWidget 
          onPress={onBarlinePress}
          onDataUpdate={handleBarlineDataUpdate}
          compact={compact}
        />
        <HonestSignWidget 
          onPress={onHonestSignPress}
          onDataUpdate={handleHonestSignDataUpdate}
          compact={compact}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Заголовок секции с кнопкой обновления */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Интеграции
        </Text>
        
        <View style={styles.headerActions}>
          {loading && (
            <ActivityIndicator 
              size="small" 
              color={colors.primary} 
              style={styles.loadingIndicator}
            />
          )}
          
          <Text style={[styles.lastUpdateText, { color: colors.textSecondary }]}>
            {lastUpdate ? `Обновлено: ${lastUpdate.toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}` : 'Еще не обновлялось'}
          </Text>
        </View>
      </View>

      {/* Контент с возможностью скролла если много виджетов */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.widgetsScroll}
        contentContainerStyle={styles.widgetsContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={refreshAllWidgets}
            colors={[colors.primary]}
            tintColor={colors.primary}
            size="small"
          />
        }
      >
        <BarlineWidget 
          onPress={onBarlinePress}
          onDataUpdate={handleBarlineDataUpdate}
          style={styles.widget}
        />
        
        <HonestSignWidget 
          onPress={onHonestSignPress}
          onDataUpdate={handleHonestSignDataUpdate}
          style={styles.widget}
        />
        
        {/* Место для будущих виджетов */}
        <View style={[styles.placeholderWidget, { backgroundColor: colors.backgroundGlass }]}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            + Новая интеграция
          </Text>
        </View>
      </ScrollView>

      {/* Статус виджетов */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View 
            style={[
              styles.statusIndicator, 
              { 
                backgroundColor: widgetsState.barline.error ? colors.error : 
                               widgetsState.barline.data ? colors.success : colors.textSecondary 
              }
            ]} 
          />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Barline {widgetsState.barline.error ? '— Ошибка' : widgetsState.barline.data ? '— Активен' : '— Загрузка'}
          </Text>
        </View>
        
        <View style={styles.statusItem}>
          <View 
            style={[
              styles.statusIndicator, 
              { 
                backgroundColor: widgetsState.honestSign.error ? colors.error : 
                               widgetsState.honestSign.data ? colors.success : colors.textSecondary 
              }
            ]} 
          />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Честный знак {widgetsState.honestSign.error ? '— Ошибка' : widgetsState.honestSign.data ? '— Активен' : '— Загрузка'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  compactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  lastUpdateText: {
    fontSize: 12,
    opacity: 0.7,
  },
  widgetsScroll: {
    marginHorizontal: -20,
  },
  widgetsContent: {
    paddingHorizontal: 20,
  },
  widget: {
    width: 280,
    marginRight: 12,
  },
  placeholderWidget: {
    width: 120,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    opacity: 0.5,
  },
  placeholderText: {
    fontSize: 12,
    textAlign: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    opacity: 0.7,
  },
});

export default React.memo(IntegrationWidgetsContainer);