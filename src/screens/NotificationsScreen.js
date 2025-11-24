// src/screens/NotificationsScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Alert,
  Animated
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { glassStyle, blueGlassStyle, orangeGlassStyle } from '../styles/themes';
import { 
  NotificationIcon,
  ArrowBackIcon,
  WarningIcon,
  InfoIcon,
  ErrorIcon,
  MessageIcon
} from '../components/IconSystem';

const NotificationsScreen = ({ navigation }) => {
  const { notifications = [], clearNotifications, markAsRead } = useApp();
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const onRefresh = async () => {
    setRefreshing(true);
    // Здесь может быть логика обновления уведомлений
    setRefreshing(false);
  };

  const handleClearNotifications = () => {
    Alert.alert(
      'Очистка уведомлений',
      'Вы уверены, что хотите удалить все уведомления?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить', 
          style: 'destructive',
          onPress: () => clearNotifications?.()
        }
      ]
    );
  };

  const handleMarkAsRead = (notificationId) => {
    if (markAsRead) {
      markAsRead(notificationId);
    }
  };

  // ЗАМЕНА: функция возвращает компоненты иконок вместо эмодзи
  const getNotificationIcon = (type) => {
    const iconProps = { size: 20, color: currentTheme.colors.text };
    switch (type) {
      case 'warning': return <WarningIcon {...iconProps} />;
      case 'info': return <InfoIcon {...iconProps} />;
      case 'alert': return <ErrorIcon {...iconProps} />;
      default: return <MessageIcon {...iconProps} />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'warning': return { borderLeftColor: currentTheme.colors.warning };
      case 'info': return { borderLeftColor: currentTheme.colors.info };
      case 'alert': return { borderLeftColor: currentTheme.colors.error };
      default: return { borderLeftColor: currentTheme.colors.textSecondary };
    }
  };

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
            {/* ЗАМЕНА: стрелка назад на иконку */}
            <ArrowBackIcon size={24} color={currentTheme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            {/* ЗАМЕНА: эмодзи уведомления на иконку */}
            <View style={styles.titleContainer}>
              <NotificationIcon size={24} color={currentTheme.colors.text} />
              <Text style={[styles.title, { color: currentTheme.colors.text }]}> Уведомления</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[
              styles.clearButton,
              safeNotifications.length === 0 && styles.clearButtonDisabled
            ]}
            onPress={handleClearNotifications}
            disabled={safeNotifications.length === 0}
          >
            <Text style={[
              styles.clearButtonText,
              safeNotifications.length === 0 && styles.clearButtonTextDisabled
            ]}>
              Очистить
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[currentTheme.colors.primary, currentTheme.colors.secondary]}
          />
        }
      >
        {safeNotifications.length === 0 ? (
          <Animated.View 
            style={[
              styles.emptyState,
              glassStyle(currentTheme),
              { opacity: fadeAnim }
            ]}
          >
            <Text style={[styles.emptyStateText, { color: currentTheme.colors.text }]}>Нет уведомлений</Text>
            <Text style={[styles.emptyStateSubtext, { color: currentTheme.colors.textSecondary }]}>
              Здесь будут появляться важные уведомления о ваших ресторанах
            </Text>
          </Animated.View>
        ) : (
          safeNotifications.map((notification, index) => (
            <Animated.View
              key={notification.id}
              style={[
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
              <TouchableOpacity 
                style={[
                  glassStyle(currentTheme),
                  styles.notificationCard,
                  getNotificationStyle(notification.type),
                  notification.read && styles.readNotification
                ]}
                onPress={() => handleMarkAsRead(notification.id)}
              >
                <View style={styles.notificationHeader}>
                  {/* ЗАМЕНА: эмодзи на иконки */}
                  <View style={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  <View style={styles.notificationInfo}>
                    <Text style={[styles.notificationMessage, { color: currentTheme.colors.text }]}>
                      {notification.message}
                    </Text>
                    <Text style={[styles.notificationTime, { color: currentTheme.colors.textSecondary }]}>
                      {notification.timestamp ? new Date(notification.timestamp).toLocaleString('ru-RU') : 'Только что'}
                    </Text>
                  </View>
                  {!notification.read && (
                    <View style={[styles.unreadIndicator, { backgroundColor: currentTheme.colors.primary }]} />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
        
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
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e74c3c',
  },
  clearButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButtonTextDisabled: {
    color: '#7f8c8d',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    marginTop: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
  readNotification: {
    opacity: 0.6,
  },
  bottomSpace: {
    height: 20,
  },
});

export default NotificationsScreen;