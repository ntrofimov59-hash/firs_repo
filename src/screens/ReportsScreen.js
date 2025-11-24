// src/screens/ReportsScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Animated,
  Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import ScreenLayout from '../components/JS ScreenLayout';
import ReportChart from '../components/ReportChart';
import { glassStyle, blueGlassStyle, orangeGlassStyle } from '../styles/themes';
import ExportService from '../services/exportService';
import {
  ReportsIcon,
  ChartIcon,
  DocumentIcon,
  DownloadIcon,
  ExportIcon,
  PackageIcon,
  MoneyIcon,
  RestaurantIcon,
  EmployeesIcon,
  SupplyIcon,
  CalendarIcon,
  InfoIcon,
  EyeIcon,
  PrintIcon,
  RefreshIcon,
  SettingsIcon,
  StarIcon,
  TrophyIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '../components/IconSystem';

const { width } = Dimensions.get('window');

const ReportsScreen = ({ navigation }) => {
  const { currentTheme } = useTheme();
  const { restaurants, reports } = useApp();
  const styles = useThemedStyles(staticStyles);
  
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState('');
  const [exportType, setExportType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Данные для графиков
  const revenueChartData = {
    labels: reports.monthlyRevenue?.map(item => item.month) || ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
    datasets: [
      {
        data: reports.monthlyRevenue?.map(item => (item.revenue || 0) / 1000000) || [4.5, 5.2, 4.8, 6.1, 5.9, 6.5],
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Выручка (млн ₽)'],
  };

  const performanceChartData = {
    labels: reports.restaurantPerformance?.map(item => item.name) || ['Белладжио', 'Бургер Хаус', 'Паста Бар', 'Суши Мастер'],
    datasets: [
      {
        data: reports.restaurantPerformance?.map(item => (item.revenue || 0) / 1000000) || [2.5, 3.1, 1.9, 2.2],
      },
    ],
  };

  const popularDishesChartData = reports.popularDishes?.slice(0, 5).map((dish, index) => ({
    name: dish.name,
    value: dish.orders || 0,
    color: `hsl(${index * 60}, 70%, 50%)`,
    legendFontColor: currentTheme.colors.text,
    legendFontSize: 12,
  })) || [
    { name: 'Чизбургер', value: 1250, color: '#FF6384' },
    { name: 'Ролл Филадельфия', value: 980, color: '#36A2EB' },
    { name: 'Карбонара', value: 760, color: '#FFCE56' },
    { name: 'Том Ям', value: 680, color: '#4BC0C0' },
    { name: 'Маргарита', value: 550, color: '#9966FF' },
  ];

  // Моковые данные для отчетов
  const availableReports = [
    {
      id: 1,
      type: 'daily',
      title: 'Ежедневный отчет по продажам',
      description: 'Подробная статистика продаж за день',
      formats: ['PDF', 'CSV'],
      chartData: revenueChartData
    },
    {
      id: 2,
      type: 'revenue',
      title: 'Отчет по выручке',
      description: 'Анализ доходов и финансовых показателей',
      formats: ['PDF', 'CSV'],
      chartData: revenueChartData
    },
    {
      id: 3,
      type: 'staff',
      title: 'Отчет по персоналу',
      description: 'Рабочее время и эффективность сотрудников',
      formats: ['PDF'],
      chartData: performanceChartData
    },
    {
      id: 4,
      type: 'supplies',
      title: 'Отчет по поставкам',
      description: 'Статистика закупок и расходов на поставки',
      formats: ['PDF', 'CSV'],
      chartData: popularDishesChartData
    }
  ];

  const formatRevenue = (revenue) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(revenue);
  };

  // Функции экспорта для просмотра
  const handleExport = (format) => {
    setExportLoading(true);
    try {
      const exportDataObj = {
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

      let data;
      let type;

      if (format === 'text') {
        data = ExportService.generateTextReport(exportDataObj);
        type = 'Текстовый отчет';
      } else if (format === 'csv') {
        data = ExportService.generateCSVReport(exportDataObj);
        type = 'CSV данные';
      } else if (format === 'json') {
        data = ExportService.generateJSONReport(exportDataObj);
        type = 'JSON данные';
      }

      setExportData(data);
      setExportType(type);
      setShowExportModal(true);
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Ошибка', 'Не удалось сгенерировать данные для экспорта');
    } finally {
      setExportLoading(false);
    }
  };

  const exportFormats = ExportService.getExportFormats();

  const handleReportGeneration = async (report, format) => {
    setLoading(true);
    
    try {
      // Имитация генерации отчета
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Успех', 
        `Отчет "${report.title}" успешно сгенерирован в формате ${format}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сгенерировать отчет');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomReport = (report) => {
    setSelectedReport(report);
    setShowDateModal(true);
  };

  const generateCustomReport = async () => {
    if (!selectedReport) return;
    
    setShowDateModal(false);
    setLoading(true);
    
    setTimeout(() => {
      handleReportGeneration(selectedReport, 'PDF');
    }, 1000);
  };

  const ReportCard = ({ report, index }) => (
    <Animated.View
      style={[
        styles.reportCard, 
        glassStyle(currentTheme),
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50 * (index + 1), 0],
            })
          }]
        }
      ]}
    >
      <View style={styles.reportHeader}>
        <Text style={[styles.reportTitle, { color: currentTheme.colors.text }]}>{report.title}</Text>
        <Text style={[styles.reportDescription, { color: currentTheme.colors.textSecondary }]}>{report.description}</Text>
      </View>
      
      {/* Предпросмотр графика для отчета */}
      {report.chartData && (
        <View style={styles.chartPreview}>
          <ReportChart
            type={report.type === 'supplies' ? 'pie' : report.type === 'staff' ? 'bar' : 'line'}
            data={report.chartData}
            height={120}
            title=""
          />
        </View>
      )}
      
      <View style={styles.reportActions}>
        <View style={styles.formatsContainer}>
          <Text style={[styles.formatsLabel, { color: currentTheme.colors.textSecondary }]}>Форматы:</Text>
          <View style={styles.formatButtons}>
            {report.formats.map(format => (
              <TouchableOpacity
                key={format}
                style={[styles.formatButton, format === 'PDF' ? blueGlassStyle(currentTheme) : orangeGlassStyle(currentTheme)]}
                onPress={() => handleReportGeneration(report, format)}
                disabled={loading}
              >
                <View style={styles.formatButtonContent}>
                  <DocumentIcon size={16} color={currentTheme.colors.text} />
                  <Text style={[styles.formatButtonText, { color: currentTheme.colors.text }]}>
                    {format}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.customButton, glassStyle(currentTheme)]}
          onPress={() => handleCustomReport(report)}
          disabled={loading}
        >
          <View style={styles.customButtonContent}>
            <SettingsIcon size={16} color={currentTheme.colors.primary} />
            <Text style={[styles.customButtonText, { color: currentTheme.colors.primary }]}>
              Настроить период
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <ScreenLayout
      title="Отчеты"
      icon={ReportsIcon}
      onFabPress={() => navigation.navigate('GenerateReport')}
      fabIcon="document-text"
    >
      {(loading || exportLoading) && (
        <View style={[styles.loadingOverlay, { backgroundColor: currentTheme.colors.backgroundGlass }]}>
          <ActivityIndicator size="large" color={currentTheme.colors.secondary} />
          <Text style={[styles.loadingText, { color: currentTheme.colors.text }]}>
            {exportLoading ? 'Подготовка данных...' : 'Генерация отчета...'}
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Статистика */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.statsCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <ChartIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Быстрая статистика</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: currentTheme.colors.text }]}>
                {formatRevenue(
                  restaurants.reduce((sum, r) => sum + (r.currentRevenue || 0), 0)
                )}
              </Text>
              <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Общая выручка</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: currentTheme.colors.text }]}>
                {restaurants.reduce((sum, r) => sum + (r.todaySales || 0), 0)}
              </Text>
              <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Всего заказов</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: currentTheme.colors.text }]}>
                {restaurants.filter(r => r.isOpen).length}/{restaurants.length}
              </Text>
              <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Открыто ресторанов</Text>
            </View>
          </View>
        </Animated.View>

        {/* Графики аналитики */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.analyticsCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <ChartIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Аналитика в реальном времени</Text>
          </View>
          
          <View style={styles.chartsContainer}>
            <View style={styles.chartWrapper}>
              <ReportChart
                type="line"
                data={revenueChartData}
                height={180}
                title="Динамика выручки (млн ₽)"
              />
            </View>
            
            <View style={styles.chartWrapper}>
              <ReportChart
                type="bar"
                data={performanceChartData}
                height={180}
                title="Производительность ресторанов"
              />
            </View>
            
            <View style={styles.chartWrapper}>
              <ReportChart
                type="pie"
                data={popularDishesChartData}
                height={180}
                title="Популярные блюда"
              />
            </View>
          </View>
        </Animated.View>

        {/* Доступные отчеты */}
        <View style={styles.reportsSection}>
          <View style={styles.sectionTitleContainer}>
            <DocumentIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Доступные отчеты</Text>
          </View>
          
          {availableReports.map((report, index) => (
            <ReportCard key={report.id} report={report} index={index} />
          ))}
        </View>

        {/* Секция экспорта данных */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.exportCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <ExportIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Экспорт данных</Text>
          </View>
          <Text style={[styles.exportDescription, { color: currentTheme.colors.textSecondary }]}>
            Просмотр данных в различных форматах для копирования и дальнейшего анализа
          </Text>
          
          <View style={styles.exportFormatsContainer}>
            {exportFormats.map((format) => (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.exportFormatCard,
                  glassStyle(currentTheme),
                  { borderLeftColor: format.color, borderLeftWidth: 4 }
                ]}
                onPress={() => handleExport(format.id)}
                disabled={exportLoading}
              >
                <View style={styles.exportFormatHeader}>
                  <View style={styles.exportFormatIcon}>
                    {format.id === 'text' && <DocumentIcon size={24} color={currentTheme.colors.text} />}
                    {format.id === 'csv' && <DocumentIcon size={24} color={currentTheme.colors.text} />}
                    {format.id === 'json' && <DocumentIcon size={24} color={currentTheme.colors.text} />}
                  </View>
                  <View style={styles.exportFormatInfo}>
                    <Text style={[styles.exportFormatName, { color: currentTheme.colors.text }]}>
                      {format.name}
                    </Text>
                    <Text style={[styles.exportFormatDesc, { color: currentTheme.colors.textSecondary }]}>
                      {format.description}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.exportButton, { backgroundColor: format.color }]}
                  onPress={() => handleExport(format.id)}
                  disabled={exportLoading}
                >
                  <EyeIcon size={16} color="white" />
                  <Text style={styles.exportButtonText}>Просмотр</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.exportInfo}>
            <View style={styles.exportInfoHeader}>
              <InfoIcon size={16} color={currentTheme.colors.text} />
              <Text style={[styles.exportInfoTitle, { color: currentTheme.colors.text }]}>
                Как использовать:
              </Text>
            </View>
            <View style={styles.exportInfoItem}>
              <Text style={[styles.exportInfoText, { color: currentTheme.colors.textSecondary }]}>
                • Нажмите на формат для просмотра данных
              </Text>
            </View>
            <View style={styles.exportInfoItem}>
              <Text style={[styles.exportInfoText, { color: currentTheme.colors.textSecondary }]}>
                • Долго нажмите на текст для копирования
              </Text>
            </View>
            <View style={styles.exportInfoItem}>
              <Text style={[styles.exportInfoText, { color: currentTheme.colors.textSecondary }]}>
                • Используйте для анализа в сторонних приложениях
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Предпросмотр отчета */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.previewCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <EyeIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Предпросмотр отчета</Text>
          </View>
          <Text style={[styles.previewText, { color: currentTheme.colors.textSecondary }]}>
            При генерации отчета в формате PDF вы получите документ с:
          </Text>
          <View style={styles.previewList}>
            <View style={styles.previewItem}>
              <Text style={[styles.previewItemText, { color: currentTheme.colors.textSecondary }]}>
                • Сводной статистикой по всем ресторанам
              </Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={[styles.previewItemText, { color: currentTheme.colors.textSecondary }]}>
                • Детальной таблицей по каждому ресторану
              </Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={[styles.previewItemText, { color: currentTheme.colors.textSecondary }]}>
                • Аналитикой эффективности
              </Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={[styles.previewItemText, { color: currentTheme.colors.textSecondary }]}>
                • Графиками и диаграммами
              </Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={[styles.previewItemText, { color: currentTheme.colors.textSecondary }]}>
                • Рекомендациями по улучшению
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.previewButton, blueGlassStyle(currentTheme)]}
            onPress={() => {
              handleReportGeneration(availableReports[0], 'PDF');
            }}
            disabled={loading}
          >
            <View style={styles.previewButtonContent}>
              <EyeIcon size={16} color={currentTheme.colors.text} />
              <Text style={[styles.previewButtonText, { color: currentTheme.colors.text }]}>
                Посмотреть пример отчета
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Модальное окно выбора даты */}
      <Modal
        visible={showDateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, glassStyle(currentTheme)]}>
            <Text style={[styles.modalTitle, { color: currentTheme.colors.text }]}>
              Настройка периода для "{selectedReport?.title}"
            </Text>
            
            <View style={styles.dateInputs}>
              <View style={styles.dateInput}>
                <View style={styles.dateLabelContainer}>
                  <CalendarIcon size={16} color={currentTheme.colors.text} />
                  <Text style={[styles.dateLabel, { color: currentTheme.colors.text }]}>Дата начала:</Text>
                </View>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentTheme.colors.card,
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text 
                  }]}
                  value={dateRange.startDate}
                  onChangeText={(text) => setDateRange(prev => ({...prev, startDate: text}))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                />
              </View>
              
              <View style={styles.dateInput}>
                <View style={styles.dateLabelContainer}>
                  <CalendarIcon size={16} color={currentTheme.colors.text} />
                  <Text style={[styles.dateLabel, { color: currentTheme.colors.text }]}>Дата окончания:</Text>
                </View>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentTheme.colors.card,
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text 
                  }]}
                  value={dateRange.endDate}
                  onChangeText={(text) => setDateRange(prev => ({...prev, endDate: text}))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, glassStyle(currentTheme)]}
                onPress={() => setShowDateModal(false)}
                disabled={loading}
              >
                <Text style={[styles.cancelButtonText, { color: currentTheme.colors.text }]}>Отмена</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.generateButton, orangeGlassStyle(currentTheme)]}
                onPress={generateCustomReport}
                disabled={loading}
              >
                <View style={styles.generateButtonContent}>
                  <PrintIcon size={16} color={currentTheme.colors.text} />
                  <Text style={[styles.generateButtonText, { color: currentTheme.colors.text }]}>
                    {loading ? 'Генерация...' : 'Сгенерировать'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно экспорта данных */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <View style={[styles.modalContent, glassStyle(currentTheme), { maxHeight: '90%', width: '95%' }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.colors.text }]}>
              {exportType}
            </Text>
            
            <View style={styles.exportHelpContainer}>
              <InfoIcon size={16} color={currentTheme.colors.textSecondary} />
              <Text style={[styles.exportHelpText, { color: currentTheme.colors.textSecondary }]}>
                Долго нажмите на текст для копирования
              </Text>
            </View>
            
            <ScrollView style={styles.exportDataContainer}>
              <Text 
                selectable={true}
                style={[styles.exportDataText, { color: currentTheme.colors.text }]}
              >
                {exportData}
              </Text>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, glassStyle(currentTheme)]}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: currentTheme.colors.text }]}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
};

const staticStyles = theme => ({
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
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  analyticsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  chartsContainer: {
    gap: 16,
  },
  chartWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  reportsSection: {
    marginBottom: 12,
  },
  reportCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  reportHeader: {
    marginBottom: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  chartPreview: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reportActions: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  formatsContainer: {
    marginBottom: 16,
  },
  formatsLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  formatButtons: {
    flexDirection: 'row',
  },
  formatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  formatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formatButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  customButton: {
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  customButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  exportCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  exportDescription: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  exportFormatsContainer: {
    gap: 12,
  },
  exportFormatCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exportFormatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exportFormatIcon: {
    marginRight: 12,
  },
  exportFormatInfo: {
    flex: 1,
  },
  exportFormatName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exportFormatDesc: {
    fontSize: 12,
  },
  exportButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  exportInfo: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  exportInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exportInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  exportInfoItem: {
    marginBottom: 4,
  },
  exportInfoText: {
    fontSize: 12,
  },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  previewText: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.7,
  },
  previewList: {
    marginBottom: 16,
  },
  previewItem: {
    marginBottom: 4,
  },
  previewItemText: {
    fontSize: 12,
    opacity: 0.7,
  },
  previewButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  bottomSpace: {
    height: 20,
  },
  // Стили для модальных окон
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateInputs: {
    marginBottom: 20,
  },
  dateInput: {
    marginBottom: 16,
  },
  dateLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  generateButton: {
    // Стиль задается через orangeGlassStyle
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  exportHelpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  exportHelpText: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  exportDataContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    maxHeight: 400,
  },
  exportDataText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default ReportsScreen;