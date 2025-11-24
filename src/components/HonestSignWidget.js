// src/components/HonestSignWidget.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import honestSignService from '../services/honestSignService';

const HonestSignWidget = ({ onPress, onDataUpdate, compact = false, style }) => {
  const { user, hasPermission } = useAuth();
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [widgetData, setWidgetData] = useState({
    markedProducts: 0,
    scannedToday: 0,
    writeOffsCount: 0,
    complianceRate: 0,
    lastUpdate: null
  });

  const loadHonestSignData = useCallback(async () => {
    if (!hasPermission('view_reports')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Загружаем данные по маркировке
      const markedProducts = await honestSignService.getMarkedProducts('all', weekAgo, today);
      const markingStats = await honestSignService.getMarkingStatistics('all');
      const writeOffs = await honestSignService.getMarkedWriteOffs('all', weekAgo, today);
      
      const totalScanned = markingStats?.scannedToday || 0;
      const totalExpected = markingStats?.expectedToday || 0;
      const complianceRate = totalExpected > 0 ? Math.round((totalScanned / totalExpected) * 100) : 100;
      
      const data = {
        markedProducts: markedProducts?.count || 0,
        scannedToday: totalScanned,
        writeOffsCount: writeOffs?.count || 0,
        complianceRate: complianceRate,
        lastUpdate: new Date()
      };
      
      setWidgetData(data);
      
      // Уведомляем контейнер об обновлении данных
      if (onDataUpdate) {
        onDataUpdate(data, null);
      }
      
    } catch (err) {
      console.error('HonestSign widget error:', err);
      const errorMsg = 'Ошибка загрузки данных';
      setError(errorMsg);
      
      // Уведомляем контейнер об ошибке
      if (onDataUpdate) {
        onDataUpdate(null, errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [hasPermission, onDataUpdate]);

  useEffect(() => {
    loadHonestSignData();
    
    // Автообновление каждые 5 минут
    const interval = setInterval(loadHonestSignData, 300000);
    return () => clearInterval(interval);
  }, [loadHonestSignData]);

  const formatNumber = (value) => {
    return new Intl.NumberFormat('ru-RU').format(value || 0);
  };

  const getComplianceColor = (rate) => {
    if (rate >= 95) return '#10b981'; // green
    if (rate >= 80) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const colors = currentTheme?.colors || {};
  
  if (!hasPermission('view_reports')) {
    return null;
  }

  // Компактный режим для горизонтального расположения
  if (compact) {
    const complianceColor = getComplianceColor(widgetData.complianceRate);
    
    return (
      <TouchableOpacity 
        style={[
          styles.compactWidget,
          style,
          { 
            backgroundColor: colors.backgroundGlass || 'rgba(255,255,255,0.1)',
            borderLeftColor: colors.info || '#3b82f6'
          }
        ]}
        onPress={onPress}
        disabled={loading}
      >
        <View style={styles.compactContent}>
          <Text style={styles.compactEmoji}>🏷️</Text>
          <View style={styles.compactTextContainer}>
            <Text style={[styles.compactTitle, { color: colors.text }]}>
              Честный знак
            </Text>
            <Text style={[styles.compactValue, { color: colors.text }]}>
              {loading ? '...' : `${widgetData.complianceRate}%`}
            </Text>
          </View>
          {loading && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.compactLoader} />
          )}
        </View>
        
        {widgetData.complianceRate < 95 && !loading && (
          <View style={[styles.compactAlert, { backgroundColor: complianceColor }]}>
            <Text style={styles.compactAlertText}>!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // Полный режим
  const complianceColor = getComplianceColor(widgetData.complianceRate);
  
  return (
    <TouchableOpacity 
      style={[
        styles.widget,
        style,
        { 
          backgroundColor: colors.backgroundGlass || 'rgba(255,255,255,0.1)',
          borderLeftColor: colors.info || '#3b82f6'
        }
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.widgetHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.widgetEmoji}>🏷️</Text>
          <Text style={[styles.widgetTitle, { color: colors.text }]}>
            Честный знак
          </Text>
        </View>
        {loading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadHonestSignData}
          >
            <Text style={[styles.retryText, { color: colors.textInverse || '#ffffff' }]}>
              Повторить
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={[styles.dataValue, { color: colors.text }]}>
                {formatNumber(widgetData.markedProducts)}
              </Text>
              <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>
                Маркированных
              </Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={[styles.dataValue, { color: colors.text }]}>
                {formatNumber(widgetData.scannedToday)}
              </Text>
              <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>
                Сканировано
              </Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={[styles.dataValue, { color: colors.text }]}>
                {formatNumber(widgetData.writeOffsCount)}
              </Text>
              <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>
                Списания
              </Text>
            </View>
          </View>

          {/* Индикатор соответствия */}
          <View style={styles.complianceSection}>
            <View style={styles.complianceHeader}>
              <Text style={[styles.complianceLabel, { color: colors.textSecondary }]}>
                Соответствие:
              </Text>
              <Text style={[styles.complianceValue, { color: complianceColor }]}>
                {widgetData.complianceRate}%
              </Text>
            </View>
            <View style={[styles.complianceBar, { backgroundColor: colors.backgroundSecondary }]}>
              <View 
                style={[
                  styles.complianceProgress, 
                  { 
                    width: `${Math.min(widgetData.complianceRate, 100)}%`,
                    backgroundColor: complianceColor
                  }
                ]} 
              />
            </View>
            <Text style={[styles.complianceHint, { color: colors.textSecondary }]}>
              {widgetData.complianceRate >= 95 ? 'Отлично' : 
               widgetData.complianceRate >= 80 ? 'Нормально' : 'Требует внимания'}
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.updateTime, { color: colors.textSecondary }]}>
              {widgetData.lastUpdate ? 
                `Обновлено: ${widgetData.lastUpdate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}` : 
                'Загрузка...'
              }
            </Text>
            <Text style={[styles.hintText, { color: colors.textSecondary }]}>
              Нажмите для деталей →
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Стили для полного режима
  widget: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    minHeight: 220,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dataItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  dataLabel: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.8,
  },
  complianceSection: {
    marginBottom: 12,
  },
  complianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complianceLabel: {
    fontSize: 12,
  },
  complianceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  complianceBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  complianceProgress: {
    height: '100%',
    borderRadius: 3,
  },
  complianceHint: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  updateTime: {
    fontSize: 10,
    opacity: 0.7,
  },
  hintText: {
    fontSize: 10,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Стили для компактного режима
  compactWidget: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    minHeight: 80,
    borderLeftWidth: 3,
    position: 'relative',
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  compactTextContainer: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  compactLoader: {
    marginLeft: 4,
  },
  compactAlert: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactAlertText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default React.memo(HonestSignWidget);