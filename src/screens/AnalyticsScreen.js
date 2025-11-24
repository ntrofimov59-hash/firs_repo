// src/screens/AnalyticsScreen.js
import React, { useState, useRef } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  ActivityIndicator,
  View
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { glassStyle, blueGlassStyle, orangeGlassStyle } from '../styles/themes';
import ReportChart from '../components/ReportChart';
import ExportService from '../services/exportService';
import ScreenLayout from '../components/JS ScreenLayout';
import ActionButton from '../components/ActionButton';
import { useThemedStyles } from '../hooks/useThemedStyles';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const { restaurants, reports, getStatistics } = useApp();
  const { currentTheme } = useTheme();
  const themedStyles = useThemedStyles(staticStyles);
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [exportLoading, setExportLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const statistics = getStatistics();
  const periodOptions = ['day', 'week', 'month', 'quarter', 'year'];

  // Данные для графика выручки
  const revenueChartData = {
    labels: reports.monthlyRevenue?.map(item => item.month) || ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
    datasets: [
      {
        data: reports.monthlyRevenue?.map(item => (item.revenue || 0) / 1000000) || [2.5, 2.8, 3.2, 2.95, 4.1, 3.85],
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Выручка (млн ₽)'],
  };

  // Данные для графика производительности ресторанов
  const performanceChartData = {
    labels: reports.restaurantPerformance?.map(item => item.name) || ['Белладжио', 'Бургер Хаус', 'Паста Бар', 'Суши Мастер'],
    datasets: [
      {
        data: reports.restaurantPerformance?.map(item => (item.revenue || 0) / 1000000) || [2.5, 3.1, 1.9, 2.2],
      },
    ],
  };

  // Функции экспорта
  const handleExport = async (format) => {
    setExportLoading(true);
    try {
      const exportData = {
        revenue: reports.monthlyRevenue || [],
        performance: reports.restaurantPerformance || [],
        dishes: reports.popularDishes || [],
        restaurants: restaurants.map(r => ({
          name: r.name,
          isOpen: r.isOpen,
          currentRevenue: r.currentRevenue || 0,
          todaySales: r.todaySales || 0,
          totalEmployees: r.totalEmployees || 0,
          rating: r.rating || 0
        }))
      };

      if (format === 'excel') {
        await ExportService.exportToExcel(exportData, 'аналитика_ресторанов');
      } else if (format === 'pdf') {
        await ExportService.exportToPDF(exportData, 'аналитика_ресторанов');
      }

      Alert.alert('Успех', `Аналитика экспортирована в ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Ошибка', 'Не удалось экспортировать аналитику');
    } finally {
      setExportLoading(false);
    }
  };

  // Рассчитываем дополнительные метрики
  const calculateMetrics = () => {
    const totalRevenue = restaurants.reduce((sum, r) => sum + (r.currentRevenue || 0), 0);
    const avgRevenuePerRestaurant = totalRevenue / (restaurants.length || 1);
    const bestPerforming = [...restaurants].sort((a, b) => (b.currentRevenue || 0) - (a.currentRevenue || 0))[0];
    const needsAttention = restaurants.filter(r => (r.currentRevenue || 0) < 50000).length;

    return {
      totalRevenue,
      avgRevenuePerRestaurant: Math.round(avgRevenuePerRestaurant),
      bestPerforming,
      needsAttention,
      totalOrders: restaurants.reduce((sum, r) => sum + (r.todaySales || 0), 0),
      avgOrderValue: totalRevenue / (restaurants.reduce((sum, r) => sum + (r.todaySales || 0), 0) || 1)
    };
  };

  const metrics = calculateMetrics();

  const renderMetricCard = (title, value, subtitle, color) => (
    <Animated.View 
      style={[
        themedStyles.metricCard,
        glassStyle(currentTheme),
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={themedStyles.metricHeader}>
        <Text style={themedStyles.metricTitle}>{title}</Text>
      </View>
      <Text style={[themedStyles.metricValue, { color }]}>{value}</Text>
      <Text style={themedStyles.metricSubtitle}>{subtitle}</Text>
    </Animated.View>
  );

  const renderContent = () => (
    <>
      {exportLoading && (
        <View style={themedStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={currentTheme.colors.secondary} />
          <Text style={themedStyles.loadingText}>
            Экспорт данных...
          </Text>
        </View>
      )}

      <ScrollView style={themedStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Период и фильтры */}
        <Animated.View 
          style={[
            themedStyles.filtersCard,
            glassStyle(currentTheme),
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={themedStyles.sectionTitle}>Период анализа</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={themedStyles.periodFilters}>
            {periodOptions.map(period => (
              <TouchableOpacity
                key={period}
                style={[
                  themedStyles.periodFilter,
                  selectedPeriod === period ? 
                    [themedStyles.periodFilterActive, { backgroundColor: currentTheme.colors.primary }] : 
                    { backgroundColor: currentTheme.colors.card }
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  themedStyles.periodFilterText,
                  selectedPeriod === period ? 
                    themedStyles.periodFilterTextActive : 
                    { color: currentTheme.colors.text }
                ]}>
                  {{
                    day: 'День',
                    week: 'Неделя',
                    month: 'Месяц',
                    quarter: 'Квартал',
                    year: 'Год'
                  }[period]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Ключевые метрики */}
        <View style={themedStyles.metricsSection}>
          <Text style={themedStyles.sectionTitle}>Ключевые метрики</Text>
          <View style={themedStyles.metricsGrid}>
            {renderMetricCard(
              'Общая выручка',
              `${(metrics.totalRevenue / 1000).toFixed(0)}K ₽`,
              'За сегодня',
              currentTheme.colors.success
            )}
            {renderMetricCard(
              'Всего заказов',
              metrics.totalOrders.toString(),
              'За сегодня',
              currentTheme.colors.primary
            )}
            {renderMetricCard(
              'Средний чек',
              `${Math.round(metrics.avgOrderValue)} ₽`,
              'На заказ',
              currentTheme.colors.secondary
            )}
            {renderMetricCard(
              'Требуют внимания',
              metrics.needsAttention.toString(),
              'Ресторанов',
              currentTheme.colors.warning
            )}
          </View>
        </View>

        {/* График выручки */}
        <Animated.View 
          style={[
            themedStyles.chartCard,
            glassStyle(currentTheme),
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={themedStyles.chartHeader}>
            <Text style={themedStyles.sectionTitle}>
              Динамика выручки
            </Text>
          </View>
          <ReportChart
            type="line"
            data={revenueChartData}
            height={220}
            title="Выручка по месяцам (млн ₽)"
          />
        </Animated.View>

        {/* График производительности ресторанов */}
        <Animated.View 
          style={[
            themedStyles.chartCard,
            glassStyle(currentTheme),
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={themedStyles.chartHeader}>
            <Text style={themedStyles.sectionTitle}>
              Производительность ресторанов
            </Text>
          </View>
          <ReportChart
            type="bar"
            data={performanceChartData}
            height={220}
            title="Выручка ресторанов (млн ₽)"
          />
        </Animated.View>

        {/* Секция экспорта */}
        <Animated.View 
          style={[
            themedStyles.exportCard,
            glassStyle(currentTheme),
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={themedStyles.exportHeader}>
            <Text style={themedStyles.sectionTitle}>Экспорт аналитики</Text>
          </View>
          <Text style={themedStyles.exportDescription}>
            Сохраните полную аналитику для углубленного анализа и отчетности
          </Text>
          
          <View style={themedStyles.exportButtonsContainer}>
            <ActionButton
              onPress={() => handleExport('excel')}
              iconName="download"
              label="Excel"
              variant="primary"
              size="medium"
              loading={exportLoading}
              disabled={exportLoading}
              style={[themedStyles.exportFormatButton, { backgroundColor: '#21BA45' }]}
            />
            
            <ActionButton
              onPress={() => handleExport('pdf')}
              iconName="download"
              label="PDF"
              variant="primary"
              size="medium"
              loading={exportLoading}
              disabled={exportLoading}
              style={[themedStyles.exportFormatButton, { backgroundColor: '#E74C3C' }]}
            />
          </View>
        </Animated.View>

        {/* Быстрые действия */}
        <Animated.View 
          style={[
            themedStyles.actionsCard,
            glassStyle(currentTheme),
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={themedStyles.sectionTitle}>Быстрые действия</Text>
          <View style={themedStyles.actionsGrid}>
            <ActionButton
              onPress={() => navigation.navigate('Reports')}
              iconName="analytics"
              label="Подробные отчеты"
              variant="outline"
              size="small"
              fullWidth
              style={themedStyles.actionButton}
            />
            
            <ActionButton
              onPress={() => navigation.navigate('EmployeeManagement')}
              iconName="people"
              label="Статистика сотрудников"
              variant="outline"
              size="small"
              fullWidth
              style={themedStyles.actionButton}
            />
            
            <ActionButton
              onPress={() => navigation.navigate('SupplyManagement')}
              iconName="cube"
              label="Аналитика поставок"
              variant="outline"
              size="small"
              fullWidth
              style={themedStyles.actionButton}
            />
            
            <ActionButton
              onPress={() => handleExport('excel')}
              iconName="download"
              label="Экспорт в Excel"
              variant="primary"
              size="small"
              loading={exportLoading}
              disabled={exportLoading}
              fullWidth
              style={themedStyles.actionButton}
            />
          </View>
        </Animated.View>

        <View style={themedStyles.bottomSpace} />
      </ScrollView>
    </>
  );

  return (
    <ScreenLayout
      title="Аналитика"
      iconName="analytics"
      showFab={false}
    >
      {renderContent()}
    </ScreenLayout>
  );
};

const staticStyles = (theme) => StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: theme.colors?.backgroundGlass || 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
    color: theme.colors?.text || '#000000',
  },
  filtersCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors?.text || '#000000',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  exportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  periodFilters: {
    marginHorizontal: -5,
  },
  periodFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  periodFilterActive: {
    // backgroundColor задается динамически
  },
  periodFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  periodFilterTextActive: {
    color: 'white',
  },
  metricsSection: {
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    color: theme.colors?.text || '#000000',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    color: theme.colors?.textSecondary || '#666666',
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  exportCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  exportDescription: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    color: theme.colors?.textSecondary || '#666666',
  },
  exportButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  exportFormatButton: {
    flex: 1,
    borderRadius: 12,
  },
  actionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    marginBottom: 0,
  },
  bottomSpace: {
    height: 20,
  },
});

export default AnalyticsScreen;