import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  AppState,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { glassStyle, blueGlassStyle, orangeGlassStyle, getThemeValue, isCorporateTheme } from '../styles/themes';
import IntegrationWidgetsContainer from '../components/IntegrationWidgetsContainer';
import useCachedData from '../hooks/useCachedData';
import { restaurantService } from '../services/enhancedServices';
import useSync from '../hooks/useSync';
import { 
  AnalyticsIcon, 
  ReportsIcon, 
  SupplyIcon, 
  EmployeesIcon,
  NotificationIcon,
  ProfileIcon,
  WarningIcon,
  PhoneIcon,
  LocationIcon,
  RefreshIcon,
  ChefIcon,
  PackageIcon,
  TrendUpIcon,
  TrendDownIcon
} from '../components/IconSystem';
import DashboardCard from '../components/JS DashboardCard';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const sync = useSync();
  
  // Безопасные значения темы
  const safeTheme = currentTheme || {};
  const colors = safeTheme.colors || {};
  
  // Только две категории
  const categories = ['Все', 'Вверх', 'Низ'];
  const [selectedCategory, setSelectedCategory] = React.useState('Все');
  const [refreshing, setRefreshing] = React.useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Низкий запас риса в Ресторане "Восток"', read: false },
    { id: 2, type: 'info', message: 'Новая поставка ожидается сегодня', read: false },
    { id: 3, type: 'alert', message: 'Смена сотрудника завершается через 1 час', read: true }
  ]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [appState, setAppState] = useState(AppState.currentState);

  // Анимации
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Используем кешированные данные для ресторанов
  const { 
    data: restaurantsData, 
    loading: restaurantsLoading, 
    error: restaurantsError,
    refresh: refreshRestaurants 
  } = useCachedData(
    'dashboard_restaurants',
    () => restaurantService.getWithCache('list'),
    {
      ttl: 2 * 60 * 1000,
      autoRefresh: true,
      refreshInterval: 30000,
      onSuccess: (data) => {
        console.log('✅ Restaurants data loaded successfully');
        setLastUpdate(new Date());
      },
      onError: (error) => {
        console.error('❌ Failed to load restaurants:', error);
      }
    }
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Автообновление данных
  const startAutoRefresh = () => {
    const interval = setInterval(() => {
      if (appState === 'active') {
        refreshRestaurants();
        setLastUpdate(new Date());
      }
    }, 30000);
    return interval;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const autoRefreshInterval = startAutoRefresh();
    return () => {
      clearInterval(autoRefreshInterval);
    };
  }, [appState]);

  // Обработчик обновления
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshRestaurants(),
        sync.forceSync().catch(error => {
          console.warn('Sync error during refresh:', error);
        })
      ]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshRestaurants, sync]);

  const quickRefreshRestaurant = async (restaurantId) => {
    try {
      restaurantService.invalidateCache('list');
      await refreshRestaurants();
    } catch (error) {
      console.error('Quick refresh failed:', error);
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Получаем рестораны из кешированных данных
  const restaurants = restaurantsData?.restaurants || [];

  const getRestaurantsNeedingAttention = () => {
    return availableRestaurants.filter(restaurant => {
      const lowRevenue = (restaurant.currentRevenue || 0) < 50000;
      const employeesArray = Array.isArray(restaurant.employees) ? restaurant.employees : [];
      const activeEmployees = employeesArray.filter(e => e && e.isActive);
      const lowStaff = activeEmployees.length < 3;
      const suppliesArray = Array.isArray(restaurant.supplies) ? restaurant.supplies : [];
      const supplyIssues = suppliesArray.length < 5;
      return lowRevenue || lowStaff || supplyIssues;
    });
  };

  // Обработчики навигации
  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const handleAnalyticsPress = () => {
    navigation.navigate('Analytics');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleNotificationsPress = () => {
    markAllNotificationsAsRead();
    navigation.navigate('Notifications');
  };

  const handleReportsPress = () => {
    navigation.navigate('Reports');
  };

  const handleAddRestaurantPress = () => {
    navigation.navigate('AddRestaurant');
  };

  const handleSupplyManagementPress = () => {
    navigation.navigate('SupplyManagement');
  };

  const handleEmployeeManagementPress = () => {
    navigation.navigate('EmployeeManagement');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  // Обработчики для виджетов
  const handleBarlinePress = () => {
    navigation.navigate('Reports', { 
      initialTab: 'barline',
      title: 'Отчеты Barline (ЕГАИС)'
    });
  };

  const handleHonestSignPress = () => {
    navigation.navigate('Reports', { 
      initialTab: 'honestSign',
      title: 'Отчеты Честный знак'
    });
  };

  const getUnreadNotificationsCount = () => {
    if (!notifications || !Array.isArray(notifications)) return 0;
    return notifications.filter(notification => !notification.read).length;
  };

  const getAvailableRestaurants = () => {
    if (!user) return [];
    if (user.role === 'admin') {
      return restaurants || [];
    }
    return (restaurants || []).filter(r => user.restaurants && user.restaurants.includes(r.id));
  };

  const availableRestaurants = getAvailableRestaurants();
  
  // Фильтрация ресторанов по выбранной категории
  const filteredRestaurants = selectedCategory === 'Все' 
    ? availableRestaurants 
    : availableRestaurants.filter(r => r.category === selectedCategory);

  const restaurantsNeedingAttention = getRestaurantsNeedingAttention();

  const formatRevenue = (revenue) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(revenue || 0);
  };

  const getTotalRevenue = () => {
    return availableRestaurants.reduce((sum, r) => sum + (r.currentRevenue || 0), 0);
  };

  const getOpenRestaurants = () => {
    return availableRestaurants.filter(r => r.isOpen).length;
  };

  const getTotalEmployees = () => {
    return availableRestaurants.reduce((sum, r) => {
      const employees = Array.isArray(r.employees) ? r.employees : [];
      return sum + employees.filter(emp => emp && emp.isActive).length;
    }, 0);
  };

  const getPendingSupplies = () => {
    return availableRestaurants.reduce((sum, r) => {
      const supplies = Array.isArray(r.supplies) ? r.supplies : [];
      return sum + supplies.filter(s => s && s.status === 'pending').length;
    }, 0);
  };

  const formatLastUpdateTime = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'только что';
    if (minutes === 1) return '1 минуту назад';
    if (minutes < 5) return `${minutes} минуты назад`;
    if (minutes < 60) return `${minutes} минут назад`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 час назад';
    if (hours < 24) return `${hours} часов назад`;
    return lastUpdate.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getActiveEmployeesCount = (restaurant) => {
    if (!restaurant.employees || !Array.isArray(restaurant.employees)) return 0;
    return restaurant.employees.filter(emp => emp && emp.isActive).length;
  };

  const getSuppliesCount = (restaurant) => {
    if (!restaurant.supplies || !Array.isArray(restaurant.supplies)) return 0;
    return restaurant.supplies.length;
  };

  // Dashboard Cards Data
  const dashboardCards = [
    {
      title: 'Сотрудники',
      value: getTotalEmployees().toString(),
      subtitle: 'Активных сегодня',
      icon: EmployeesIcon,
      onPress: handleEmployeeManagementPress,
      color: '#4CAF50',
    },
    {
      title: 'Поставки',
      value: getPendingSupplies().toString(),
      subtitle: 'Ожидается на неделе',
      icon: SupplyIcon,
      onPress: handleSupplyManagementPress,
      color: '#FF9800',
    },
    {
      title: 'Выручка',
      value: formatRevenue(getTotalRevenue()),
      subtitle: 'За сегодня',
      icon: AnalyticsIcon,
      onPress: handleAnalyticsPress,
      color: '#2196F3',
    },
    {
      title: 'Отчеты',
      value: '12',
      subtitle: 'За этот месяц',
      icon: ReportsIcon,
      onPress: handleReportsPress,
      color: '#9C27B0',
    },
  ];

  // Показываем ошибку если есть проблемы с загрузкой
  if (restaurantsError && availableRestaurants.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Ошибка загрузки данных: {restaurantsError.message}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]} 
            onPress={refreshRestaurants}
          >
            <MaterialCommunityIcons name="reload" size={20} color={colors.textInverse} />
            <Text style={[styles.retryButtonText, { color: colors.textInverse, marginLeft: 8 }]}>
              Повторить загрузку
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const unreadCount = getUnreadNotificationsCount();
  const isCorporate = isCorporateTheme(safeTheme);

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <View style={styles.headerMain}>
        <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
          Добро пожаловать
        </Text>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.name || 'Пользователь'}
        </Text>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={[
            styles.iconButton, 
            { backgroundColor: getThemeValue(safeTheme, 'effects.blueGlass.background', 'rgba(59, 130, 246, 0.1)') }
          ]}
          onPress={handleNotificationsPress}
        >
          <NotificationIcon size={20} color={colors.text} />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.iconButton, 
            { backgroundColor: getThemeValue(safeTheme, 'effects.orangeGlass.background', 'rgba(249, 115, 22, 0.1)') }
          ]}
          onPress={handleProfilePress}
        >
          <ProfileIcon size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderContent = () => (
    <Animated.ScrollView
      style={styles.scrollView}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing || restaurantsLoading} 
          onRefresh={onRefresh}
          colors={[colors.primary, colors.secondary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Статус синхронизации */}
      <View style={styles.syncStatus}>
        {sync.hasPendingOperations && (
          <View style={styles.syncIndicator}>
            <ActivityIndicator size="small" color={colors.warning} />
            <Text style={[styles.syncText, { color: colors.warning }]}>
              Синхронизация: {sync.pendingOperations} операций
            </Text>
          </View>
        )}
        
        <Text style={[styles.lastUpdate, { color: colors.textSecondary }]}>
          Обновлено: {formatLastUpdateTime()}
          {restaurantsLoading && ' (загрузка...)'}
        </Text>
      </View>

      {/* Кнопка добавления ресторана (только для админов) */}
      {user?.role === 'admin' && (
        <View style={styles.addRestaurantSection}>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddRestaurantPress}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.textInverse || '#ffffff'} />
            <Text style={[styles.addButtonText, { color: colors.textInverse || '#ffffff', marginLeft: 8 }]}>
              Добавить ресторан
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Карточки дашборда */}
      <View style={styles.dashboardCardsSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.dashboardCardsScroll}
          contentContainerStyle={styles.dashboardCardsContent}
          decelerationRate="normal"
        >
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              onPress={card.onPress}
              color={card.color}
              style={styles.dashboardCard}
            />
          ))}
        </ScrollView>
      </View>

      {/* Секция интеграций */}
      <IntegrationWidgetsContainer 
        onBarlinePress={handleBarlinePress}
        onHonestSignPress={handleHonestSignPress}
        autoRefresh={true}
      />

      {/* Фильтры ресторанов */}
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Рестораны</Text>
        <View style={styles.categoriesContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category ? 
                  [styles.categoryButtonActive, { backgroundColor: colors.primary }] : 
                  glassStyle(safeTheme)
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              {category === 'Все' && (
                <MaterialCommunityIcons 
                  name="view-grid" 
                  size={16} 
                  color={selectedCategory === category ? '#ffffff' : colors.text} 
                />
              )}
              {category === 'Вверх' && <TrendUpIcon size={16} color={selectedCategory === category ? '#ffffff' : colors.success} />}
              {category === 'Низ' && <TrendDownIcon size={16} color={selectedCategory === category ? '#ffffff' : colors.secondary} />}
              <Text style={[
                styles.categoryText,
                selectedCategory === category ? 
                  styles.categoryTextActive : 
                  { color: colors.text },
                { marginLeft: 4 }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Список ресторанов */}
      <View style={styles.restaurantsSection}>
        {restaurantsLoading && availableRestaurants.length === 0 ? (
          <View style={[styles.emptyState, glassStyle(safeTheme)]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Загрузка ресторанов...
            </Text>
          </View>
        ) : filteredRestaurants.length === 0 ? (
          <View style={[styles.emptyState, glassStyle(safeTheme)]}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={40} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              {availableRestaurants.length === 0 
                ? 'Нет доступных ресторанов' 
                : 'Нет ресторанов в выбранной категории'}
            </Text>
          </View>
        ) : (
          filteredRestaurants.map((restaurant, index) => {
            const needsAttention = restaurantsNeedingAttention.some(r => r.id === restaurant.id);
            
            return (
              <Animated.View 
                key={restaurant.id}
                style={[
                  styles.restaurantCard,
                  glassStyle(safeTheme),
                  needsAttention && { 
                    borderLeftColor: colors.warning, 
                    borderLeftWidth: 4 
                  },
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      })
                    }]
                  }
                ]}
              >
                <TouchableOpacity 
                  onPress={() => handleRestaurantPress(restaurant)}
                  onLongPress={() => quickRefreshRestaurant(restaurant.id)}
                  activeOpacity={0.7}
                >
                  {/* Заголовок карточки */}
                  <View style={styles.cardHeader}>
                    <View style={styles.restaurantMainInfo}>
                      <Text style={[styles.restaurantName, { color: colors.text }]}>
                        {restaurant.name}
                      </Text>
                      <View style={styles.categoryBadge}>
                        {restaurant.category === 'Вверх' ? (
                          <TrendUpIcon size={12} color={colors.success} />
                        ) : (
                          <TrendDownIcon size={12} color={colors.secondary} />
                        )}
                        <Text style={[
                          styles.categoryBadgeText,
                          { 
                            color: restaurant.category === 'Вверх' 
                              ? colors.success 
                              : colors.secondary,
                            marginLeft: 4
                          }
                        ]}>
                          {restaurant.category === 'Вверх' ? 'ВВЕРХ' : 'НИЗ'}
                        </Text>
                      </View>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { 
                        backgroundColor: restaurant.isOpen 
                          ? colors.successLight 
                          : colors.errorLight 
                      }
                    ]}>
                      <MaterialCommunityIcons 
                        name={restaurant.isOpen ? "check-circle" : "close-circle"} 
                        size={12} 
                        color={restaurant.isOpen ? colors.success : colors.error} 
                      />
                      <Text style={[
                        styles.statusText,
                        { 
                          color: restaurant.isOpen 
                            ? colors.success 
                            : colors.error,
                          marginLeft: 4
                        }
                      ]}>
                        {restaurant.isOpen ? 'ОТКРЫТ' : 'ЗАКРЫТ'}
                      </Text>
                    </View>
                  </View>

                  {needsAttention && (
                    <View style={[
                      styles.attentionIndicator,
                      { backgroundColor: colors.warningLight }
                    ]}>
                      <WarningIcon size={16} color={colors.warning} />
                      <Text style={[
                        styles.attentionIndicatorText,
                        { color: colors.warning, marginLeft: 4 }
                      ]}>
                        Требует внимания
                      </Text>
                    </View>
                  )}

                  {/* Основная метрика - выручка */}
                  <View style={styles.revenueSection}>
                    <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>
                      Выручка сегодня
                    </Text>
                    <Text style={[
                      styles.revenueValue,
                      { color: colors.secondary }
                    ]}>
                      {formatRevenue(restaurant.currentRevenue)}
                    </Text>
                  </View>

                  {/* Дополнительные метрики */}
                  <View style={styles.metricsGrid}>
                    <View style={styles.metricItem}>
                      <ChefIcon size={20} color={colors.textSecondary} />
                      <Text style={[styles.metricValue, { color: colors.text }]}>
                        {getActiveEmployeesCount(restaurant)}
                      </Text>
                      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                        на смене
                      </Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <PackageIcon size={20} color={colors.textSecondary} />
                      <Text style={[styles.metricValue, { color: colors.text }]}>
                        {restaurant.todaySales || 0}
                      </Text>
                      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                        продаж
                      </Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <SupplyIcon size={20} color={colors.textSecondary} />
                      <Text style={[styles.metricValue, { color: colors.text }]}>
                        {getSuppliesCount(restaurant)}
                      </Text>
                      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                        поставок
                      </Text>
                    </View>
                  </View>

                  {/* Контактная информация */}
                  <View style={styles.contactsSection}>
                    <View style={styles.contactRow}>
                      <PhoneIcon size={14} color={colors.textSecondary} />
                      <Text style={[styles.contactText, { color: colors.textSecondary, marginLeft: 6 }]}>
                        {restaurant.phone || 'Не указан'}
                      </Text>
                    </View>
                    <View style={styles.contactRow}>
                      <LocationIcon size={14} color={colors.textSecondary} />
                      <Text style={[styles.contactText, { color: colors.textSecondary, marginLeft: 6 }]}>
                        {restaurant.address || 'Не указан'}
                      </Text>
                    </View>
                  </View>

                  {/* Подсказка */}
                  <View style={styles.hintSection}>
                    <RefreshIcon size={12} color={colors.textSecondary} />
                    <Text style={[styles.hintText, { color: colors.textSecondary, marginLeft: 4 }]}>
                      Нажмите и удерживайте для обновления
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })
        )}
      </View>
      
      <View style={styles.bottomSpace} />
    </Animated.ScrollView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {renderHeader()}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerMain: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  syncStatus: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastUpdate: {
    fontSize: 12,
    opacity: 0.6,
  },
  // Секции
  addRestaurantSection: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  dashboardCardsSection: {
    marginBottom: 15,
  },
  dashboardCardsScroll: {
    marginHorizontal: -16,
  },
  dashboardCardsContent: {
    paddingHorizontal: 16,
  },
  dashboardCard: {
    width: 160,
    marginRight: 12,
  },
  addButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesSection: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  restaurantsSection: {
    paddingHorizontal: 16,
    marginTop: 10,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  // Категории
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    // backgroundColor задается динамически
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  // Карточки ресторанов
  restaurantCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantMainInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  attentionIndicator: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  revenueSection: {
    marginBottom: 16,
  },
  revenueLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
  },
  contactsSection: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    opacity: 0.7,
  },
  hintSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  hintText: {
    fontSize: 10,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  // Состояния
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButtonText: {
    fontWeight: '600',
  },
  bottomSpace: {
    height: 20,
  },
});

export default DashboardScreen;