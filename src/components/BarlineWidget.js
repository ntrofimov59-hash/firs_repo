// src/components/BarlineWidget.js
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
import barlineService from '../services/barlineService';

const BarlineWidget = ({ onPress, onDataUpdate, compact = false, style }) => {
  const { user, hasPermission } = useAuth();
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [widgetData, setWidgetData] = useState({
    totalWriteOffs: 0,
    writeOffsToday: 0,
    criticalItems: 0,
    lastUpdate: null
  });

  const loadBarlineData = useCallback(async () => {
    if (!hasPermission('view_reports')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Загружаем данные списаний
      const writeOffs = await barlineService.getAlcoholWriteOffs('all', weekAgo, today);
      const egaisReports = await barlineService.getEgaisReports('all', 'week');
      const balance = await barlineService.getAlcoholBalance('all');
      
      const data = {
        totalWriteOffs: writeOffs?.total || 0,
        writeOffsToday: writeOffs?.today || 0,
        criticalItems: balance?.criticalItems || 0,
        lastUpdate: new Date()
      };
      
      setWidgetData(data);
      
      // Уведомляем контейнер об обновлении данных
      if (onDataUpdate) {
        onDataUpdate(data, null);
      }
      
    } catch (err) {
      console.error('Barline widget error:', err);
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
    loadBarlineData();
    
    // Автообновление каждые 5 минут
    const interval = setInterval(loadBarlineData, 300000);
    return () => clearInterval(interval);
  }, [loadBarlineData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const colors = currentTheme?.colors || {};
  
  if (!hasPermission('view_reports')) {
    return null;
  }

  // Компактный режим для горизонтального расположения
  if (compact) {
    return (
      <TouchableOpacity 
        style={[
          styles.compactWidget,
          style,
          { 
            backgroundColor: colors.backgroundGlass || 'rgba(255,255,255,0.1)',
            borderLeftColor: colors.warning || '#f59e0b'
          }
        ]}
        onPress={onPress}
        disabled={loading}
      >
        <View style={styles.compactContent}>
          <Text style={styles.compactEmoji}>🍷</Text>
          <View style={styles.compactTextContainer}>
            <Text style={[styles.compactTitle, { color: colors.text }]}>
              Barline
            </Text>
            <Text style={[styles.compactValue, { color: colors.text }]}>
              {loading ? '...' : formatCurrency(widgetData.writeOffsToday)}
            </Text>
          </View>
          {loading && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.compactLoader} />
          )}
        </View>
        
        {widgetData.criticalItems > 0 && !loading && (
          <View style={[styles.compactAlert, { backgroundColor: colors.warning }]}>
            <Text style={styles.compactAlertText}>{widgetData.criticalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // Полный режим
  return (
    <TouchableOpacity 
      style={[
        styles.widget,
        style,
        { 
          backgroundColor: colors.backgroundGlass || 'rgba(255,255,255,0.1)',
          borderLeftColor: colors.warning || '#f59e0b'
        }
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.widgetHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.widgetEmoji}>🍷</Text>
          <Text style={[styles.widgetTitle, { color: colors.text }]}>
            Barline (ЕГАИС)
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
            onPress={loadBarlineData}
          >
            <Text style={[styles.retryText, { color: colors.textInverse || '#ffffff' }]}>
              Повторить
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.dataContainer}>
            <View style={styles.dataColumn}>
              <View style={styles.dataItem}>
                <Text style={[styles.dataValue, { color: colors.text }]}>
                  {formatCurrency(widgetData.writeOffsToday)}
                </Text>
                <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>
                  Списания сегодня
                </Text>
              </View>
              
              <View style={styles.dataItem}>
                <Text style={[styles.dataValue, { color: colors.text }]}>
                  {formatCurrency(widgetData.totalWriteOffs)}
                </Text>
                <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>
                  За неделю
                </Text>
              </View>
            </View>
            
            {widgetData.criticalItems > 0 && (
              <View style={[styles.alertSection, { backgroundColor: colors.warningLight }]}>
                <Text style={[styles.alertEmoji, { color: colors.warning }]}>⚠️</Text>
                <View style={styles.alertTextContainer}>
                  <Text style={[styles.alertTitle, { color: colors.warning }]}>
                    Внимание!
                  </Text>
                  <Text style={[styles.alertDescription, { color: colors.warning }]}>
                    {widgetData.criticalItems} критических позиций
                  </Text>
                </View>
              </View>
            )}
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
    minHeight: 180,
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
  dataContainer: {
    flex: 1,
  },
  dataColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dataItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  dataLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  alertSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  alertEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
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
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactAlertText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default React.memo(BarlineWidget);