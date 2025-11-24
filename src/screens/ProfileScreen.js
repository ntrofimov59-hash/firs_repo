// src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  Animated
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { glassStyle, blueGlassStyle, orangeGlassStyle } from '../styles/themes';
import { 
  ProfileIcon,
  ArrowBackIcon,
  RestaurantIcon,
  ChartIcon,
  SettingsIcon,
  LogoutIcon,
  RefreshIcon,
  InfoIcon,
  SuccessIcon,
  ErrorIcon
} from '../components/IconSystem';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { restaurants } = useApp();
  const { currentTheme } = useTheme();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ - добавлены проверки
  const getUserRestaurants = () => {
    if (!user || !restaurants || !Array.isArray(restaurants)) {
      return [];
    }
    
    if (user.role === 'admin') {
      return restaurants;
    }
    
    // ДОБАВЛЕНА ПРОВЕРКА: убеждаемся что user.restaurants существует и это массив
    if (!user.restaurants || !Array.isArray(user.restaurants)) {
      return [];
    }
    
    return restaurants.filter(r => user.restaurants.includes(r.id));
  };

  const userRestaurants = getUserRestaurants();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <StatusBar 
        barStyle={currentTheme.colors.primary === '#1E3A8A' ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* Заголовок */}
      <View style={[styles.header, { backgroundColor: currentTheme.colors.backgroundGlass }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowBackIcon size={24} color={currentTheme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <View style={styles.titleContainer}>
              <ProfileIcon size={24} color={currentTheme.colors.text} />
              <Text style={[styles.title, { color: currentTheme.colors.text }]}> Профиль</Text>
            </View>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Информация о пользователе */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.userCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <ProfileIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Информация о пользователе</Text>
          </View>
          
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: currentTheme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: currentTheme.colors.text }]}>{user?.name || 'Пользователь'}</Text>
              <Text style={[styles.userEmail, { color: currentTheme.colors.textSecondary }]}>{user?.email || 'email@example.com'}</Text>
              <View style={[
                styles.roleBadge,
                user?.role === 'admin' ? 
                  [styles.roleAdmin, { backgroundColor: currentTheme.colors.primary }] : 
                  [styles.roleManager, { backgroundColor: currentTheme.colors.secondary }]
              ]}>
                <View style={styles.roleBadgeContent}>
                  {user?.role === 'admin' ? (
                    <>
                      <ProfileIcon size={12} color="white" />
                      <Text style={styles.roleText}> Администратор</Text>
                    </>
                  ) : (
                    <>
                      <ProfileIcon size={12} color="white" />
                      <Text style={styles.roleText}> Менеджер</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Доступные рестораны */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.restaurantsCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <RestaurantIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Доступные рестораны</Text>
          </View>
          
          {userRestaurants.length > 0 ? (
            userRestaurants.map(restaurant => (
              <TouchableOpacity 
                key={restaurant.id}
                style={[styles.restaurantItem, glassStyle(currentTheme)]}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
              >
                <View style={styles.restaurantInfo}>
                  <Text style={[styles.restaurantName, { color: currentTheme.colors.text }]}>{restaurant.name}</Text>
                  <Text style={[styles.restaurantCategory, { color: currentTheme.colors.textSecondary }]}>{restaurant.category}</Text>
                </View>
                <View style={[
                  styles.statusIndicator,
                  restaurant.isOpen ? 
                    [styles.statusOpen, { backgroundColor: currentTheme.colors.successLight }] : 
                    [styles.statusClosed, { backgroundColor: currentTheme.colors.errorLight }]
                ]}>
                  {restaurant.isOpen ? (
                    <SuccessIcon size={12} color={currentTheme.colors.success} />
                  ) : (
                    <ErrorIcon size={12} color={currentTheme.colors.error} />
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.noDataText, { color: currentTheme.colors.textSecondary }]}>Нет доступных ресторанов</Text>
          )}
        </Animated.View>

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
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Статистика доступа</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: currentTheme.colors.text }]}>{userRestaurants.length}</Text>
              <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Ресторанов</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: currentTheme.colors.text }]}>
                {userRestaurants.filter(r => r.isOpen).length}
              </Text>
              <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Открыто</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: currentTheme.colors.text }]}>
                {user?.role === 'admin' ? 'Все' : 'Ограничен'}
              </Text>
              <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Доступ</Text>
            </View>
          </View>
        </Animated.View>

        {/* Действия */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.actionsCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <SettingsIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Действия</Text>
          </View>
          
          <TouchableOpacity style={[styles.actionButton, blueGlassStyle(currentTheme)]}>
            <View style={styles.actionButtonContent}>
              <RefreshIcon size={16} color={currentTheme.colors.text} />
              <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}> Синхронизировать данные</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, orangeGlassStyle(currentTheme)]}>
            <View style={styles.actionButtonContent}>
              <InfoIcon size={16} color={currentTheme.colors.text} />
              <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}> О приложении</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, blueGlassStyle(currentTheme)]}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.actionButtonContent}>
              <SettingsIcon size={16} color={currentTheme.colors.text} />
              <Text style={[styles.actionButtonText, { color: currentTheme.colors.text }]}> Настройки приложения</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton, orangeGlassStyle(currentTheme)]}
            onPress={handleLogout}
          >
            <View style={styles.actionButtonContent}>
              <LogoutIcon size={16} color={currentTheme.colors.text} />
              <Text style={[styles.logoutButtonText, { color: currentTheme.colors.text }]}> Выйти из системы</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Обновленные стили
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
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 40,
  },
  userCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  restaurantsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  actionsCard: {
    borderRadius: 16,
    padding: 20,
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
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleAdmin: {
    // backgroundColor задается динамически
  },
  roleManager: {
    // backgroundColor задается динамически
  },
  roleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '500',
  },
  restaurantCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  statusIndicator: {
    padding: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusOpen: {
    // backgroundColor задается динамически
  },
  statusClosed: {
    // backgroundColor задается динамически
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    // Стиль такой же как у других кнопок
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpace: {
    height: 20,
  },
});

export default ProfileScreen;