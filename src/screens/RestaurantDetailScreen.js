// src/screens/RestaurantDetailScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Animated
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { glassStyle, blueGlassStyle, orangeGlassStyle } from '../styles/themes';

const RestaurantDetailScreen = ({ navigation, route }) => {
  const { restaurant } = route.params;
  const { currentTheme } = useTheme();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatRevenue = (revenue) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(revenue);
  };

  const getActiveEmployees = () => {
    return restaurant.employees?.filter(emp => emp.isActive) || [];
  };

  const getSupplyStatusColor = (status) => {
    switch (status) {
      case 'доставлено': return currentTheme.colors.success;
      case 'в пути': return currentTheme.colors.warning;
      case 'ожидает': return currentTheme.colors.error;
      default: return currentTheme.colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <StatusBar 
        barStyle={currentTheme.colors.primary === '#1E3A8A' ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* Заголовок с кнопкой назад */}
      <View style={[styles.header, { backgroundColor: currentTheme.colors.backgroundGlass }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: currentTheme.colors.text }]}>← Назад</Text>
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={[styles.restaurantTitle, { color: currentTheme.colors.text }]}>{restaurant.name}</Text>
            <Text style={[styles.restaurantSubtitle, { color: currentTheme.colors.textSecondary }]}>{restaurant.category}</Text>
          </View>
          <View style={styles.headerStatus}>
            <View style={[
              styles.statusBadge,
              restaurant.isOpen ? 
                [styles.statusOpen, { backgroundColor: currentTheme.colors.successLight }] : 
                [styles.statusClosed, { backgroundColor: currentTheme.colors.errorLight }]
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: restaurant.isOpen ? currentTheme.colors.success : currentTheme.colors.error }
              ]}>
                {restaurant.isOpen ? '🟢 ОТКРЫТ' : '🔴 ЗАКРЫТ'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Основная информация */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.infoCard,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>📊 Основная информация</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: currentTheme.colors.textSecondary }]}>Выручка сегодня</Text>
              <Text style={[styles.infoValue, { color: currentTheme.colors.text }]}>{formatRevenue(restaurant.currentRevenue)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: currentTheme.colors.textSecondary }]}>Заказов</Text>
              <Text style={[styles.infoValue, { color: currentTheme.colors.text }]}>{restaurant.todayStats?.orders || 0}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: currentTheme.colors.textSecondary }]}>Средний чек</Text>
              <Text style={[styles.infoValue, { color: currentTheme.colors.text }]}>
                {formatRevenue(restaurant.todayStats?.averageOrder || 0)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: currentTheme.colors.textSecondary }]}>График</Text>
              <Text style={[styles.infoValue, { color: currentTheme.colors.text }]}>{restaurant.schedule}</Text>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <Text style={[styles.contactItem, { color: currentTheme.colors.textSecondary }]}>📞 {restaurant.phone}</Text>
            <Text style={[styles.contactItem, { color: currentTheme.colors.textSecondary }]}>📍 {restaurant.address}</Text>
          </View>
        </Animated.View>

        {/* Популярные товары */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.popularCard,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>🔥 Популярные товары</Text>
          {restaurant.todayStats?.popularItems?.map((item, index) => (
            <View key={index} style={styles.popularItem}>
              <Text style={[styles.popularItemName, { color: currentTheme.colors.text }]}>{item.name}</Text>
              <Text style={[styles.popularItemCount, { color: currentTheme.colors.textSecondary }]}>{item.count} продаж</Text>
            </View>
          )) || (
            <Text style={[styles.noDataText, { color: currentTheme.colors.textSecondary }]}>Нет данных о продажах</Text>
          )}
        </Animated.View>

        {/* Сотрудники на смене */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.employeesCard,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            👥 Сотрудники на смене ({getActiveEmployees().length})
          </Text>
          {restaurant.employees?.map((employee, index) => (
            <View key={employee.id || index} style={styles.employeeItem}>
              <View style={styles.employeeInfo}>
                <Text style={[styles.employeeName, { color: currentTheme.colors.text }]}>{employee.name}</Text>
                <Text style={[styles.employeePosition, { color: currentTheme.colors.textSecondary }]}>{employee.position}</Text>
              </View>
              <View style={[
                styles.employeeStatus,
                employee.isActive ? 
                  [styles.employeeActive, { backgroundColor: currentTheme.colors.successLight }] : 
                  [styles.employeeInactive, { backgroundColor: currentTheme.colors.errorLight }]
              ]}>
                <Text style={[
                  styles.employeeStatusText,
                  { color: employee.isActive ? currentTheme.colors.success : currentTheme.colors.error }
                ]}>
                  {employee.isActive ? 'На смене' : 'Неактивен'}
                </Text>
              </View>
            </View>
          )) || (
            <Text style={[styles.noDataText, { color: currentTheme.colors.textSecondary }]}>Нет данных о сотрудниках</Text>
          )}
        </Animated.View>

        {/* Поставки */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.suppliesCard,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>🚚 Поставки товаров</Text>
          {restaurant.supplies?.map((supply, index) => (
            <View key={supply.id || index} style={styles.supplyItem}>
              <View style={styles.supplyInfo}>
                <Text style={[styles.supplyProduct, { color: currentTheme.colors.text }]}>{supply.product}</Text>
                <Text style={[styles.supplyQuantity, { color: currentTheme.colors.textSecondary }]}>
                  {supply.quantity} {supply.unit}
                </Text>
              </View>
              <View style={[
                styles.supplyStatus,
                { backgroundColor: getSupplyStatusColor(supply.status) }
              ]}>
                <Text style={styles.supplyStatusText}>
                  {supply.status}
                </Text>
              </View>
            </View>
          )) || (
            <Text style={[styles.noDataText, { color: currentTheme.colors.textSecondary }]}>Нет данных о поставках</Text>
          )}
        </Animated.View>

        {/* Кнопки действий */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.actionsCard,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>⚡ Быстрые действия</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, blueGlassStyle(currentTheme)]}
            onPress={() => {
              navigation.navigate('EmployeeManagement', { restaurant });
            }}
          >
            <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}>👥 Управление сменой</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, orangeGlassStyle(currentTheme)]}
            onPress={() => {
              navigation.navigate('SupplyManagement', { restaurant });
            }}
          >
            <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}>📦 Управление поставками</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, blueGlassStyle(currentTheme)]}>
            <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}>📊 Подробная аналитика</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton, glassStyle(currentTheme)]}>
            <Text style={[styles.actionButtonText, styles.secondaryButtonText, { color: currentTheme.colors.primary }]}>
              ✏️ Редактировать информацию
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  restaurantTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusOpen: {
    // backgroundColor задается динамически
  },
  statusClosed: {
    // backgroundColor задается динамически
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  popularCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  employeesCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  suppliesCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  actionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 15,
  },
  contactItem: {
    fontSize: 14,
    marginBottom: 8,
  },
  popularItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  popularItemName: {
    fontSize: 14,
    flex: 1,
  },
  popularItemCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  employeePosition: {
    fontSize: 12,
    marginTop: 2,
  },
  employeeStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  employeeActive: {
    // backgroundColor задается динамически
  },
  employeeInactive: {
    // backgroundColor задается динамически
  },
  employeeStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  supplyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  supplyInfo: {
    flex: 1,
  },
  supplyProduct: {
    fontSize: 14,
    fontWeight: '500',
  },
  supplyQuantity: {
    fontSize: 12,
    marginTop: 2,
  },
  supplyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  supplyStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  secondaryButtonText: {
    // color задается динамически
  },
  bottomSpace: {
    height: 20,
  },
});

export default RestaurantDetailScreen;