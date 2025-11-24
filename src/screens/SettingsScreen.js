// src/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Switch,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
  Animated
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { glassStyle, blueGlassStyle, orangeGlassStyle } from '../styles/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SettingsIcon,
  ArrowBackIcon as BackIcon, // Используем ArrowBackIcon как BackIcon
  SaveIcon,
  PaletteIcon,
  BellIcon,
  RefreshIcon,
  GlobeIcon,
  SatelliteIcon,
  PhoneIcon,
  EmailIcon,
  DocumentIcon,
  AlertIcon,
  TrashIcon,
  LogoutIcon,
  BanIcon,
  MoonIcon,
  BuildingIcon,
  SunIcon,
  CheckCircleIcon as ConnectedIcon, // Используем CheckCircleIcon как ConnectedIcon
  CloseCircleIcon as DisconnectedIcon, // Используем CloseCircleIcon как DisconnectedIcon
  TestIcon,
  SecurityIcon,
  SyncIcon,
  StorageIcon
} from '../components/IconSystem';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { isWsConnected, disconnectRealTime, initializeRealTimeUpdates } = useApp();
  const { theme, changeTheme, currentTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibrations: true,
    autoRefresh: true,
    darkMode: false,
    language: 'ru',
    currency: 'RUB',
    syncInterval: 30,
    dataRetention: 90
  });

  const [apiConfig, setApiConfig] = useState({
    iiko: {
      apiKey: '',
      organizationId: '',
      baseUrl: 'https://api.iiko.com/api/1'
    },
    barline: {
      apiKey: '',
      baseUrl: 'https://api.barline.ru/api'
    },
    honestSign: {
      apiKey: '',
      baseUrl: 'https://api.crpt.ru/api/v3'
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    loadSettings();
    loadApiConfig();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('app_settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadApiConfig = async () => {
    try {
      const storedApiConfig = await AsyncStorage.getItem('api_config');
      if (storedApiConfig) {
        setApiConfig(JSON.parse(storedApiConfig));
      }
    } catch (error) {
      console.error('Error loading API config:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
      Alert.alert('Успех', 'Настройки сохранены');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить настройки');
    } finally {
      setSaving(false);
    }
  };

  const saveApiConfig = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('api_config', JSON.stringify(apiConfig));
      Alert.alert('Успех', 'Конфигурация API сохранена');
      
      await disconnectRealTime();
      setTimeout(() => {
        initializeRealTimeUpdates();
      }, 2000);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить конфигурацию API');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApiConfigChange = (service, field, value) => {
    setApiConfig(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
  };

  const testApiConnection = async (service) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isConnected = Math.random() > 0.3;
      
      if (isConnected) {
        Alert.alert('Успех', `Подключение к ${service} установлено`);
      } else {
        Alert.alert('Ошибка', `Не удалось подключиться к ${service}. Проверьте настройки.`);
      }
    } catch (error) {
      Alert.alert('Ошибка', `Ошибка при тестировании подключения: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  const handleClearCache = () => {
    Alert.alert(
      'Очистка кэша',
      'Это действие удалит все локальные данные. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Успех', 'Кэш очищен');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось очистить кэш');
            }
          }
        }
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms');
  };

  const openSupport = () => {
    Linking.openURL('mailto:support@restaurantmanager.com');
  };

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'corporate'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex]);
  };

  const getThemeDisplayName = () => {
    switch (theme) {
      case 'light': return 'Светлая';
      case 'dark': return 'Тёмная';
      case 'corporate': return 'Корпоративная';
      default: return 'Светлая';
    }
  };

  const syncIntervals = [
    { label: '15 секунд', value: 15 },
    { label: '30 секунд', value: 30 },
    { label: '1 минута', value: 60 },
    { label: '5 минут', value: 300 }
  ];

  const dataRetentionOptions = [
    { label: '30 дней', value: 30 },
    { label: '90 дней', value: 90 },
    { label: '180 дней', value: 180 },
    { label: '1 год', value: 365 }
  ];

  const SettingRow = ({ label, description, children }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>{label}</Text>
        {description && (
          <Text style={[styles.settingDescription, { color: currentTheme.colors.textSecondary }]}>{description}</Text>
        )}
      </View>
      {children}
    </View>
  );

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
            <View style={styles.backButtonContent}>
              <BackIcon size={20} color={currentTheme.colors.text} />
              <Text style={[styles.backButtonText, { color: currentTheme.colors.text }]}>Назад</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <View style={styles.headerTitleContent}>
              <SettingsIcon size={22} color={currentTheme.colors.text} />
              <Text style={[styles.title, { color: currentTheme.colors.text }]}> Настройки</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveSettings}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={currentTheme.colors.text} />
            ) : (
              <SaveIcon size={20} color={currentTheme.colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Внешний вид */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.sectionCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeader}>
            <PaletteIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Внешний вид</Text>
          </View>
          
          <SettingRow 
            label="Тема приложения"
            description={getThemeDisplayName()}
          >
            <TouchableOpacity 
              style={[styles.themeToggle, glassStyle(currentTheme)]}
              onPress={toggleTheme}
            >
              {theme === 'dark' ? (
                <MoonIcon size={20} color={currentTheme.colors.text} />
              ) : theme === 'corporate' ? (
                <BuildingIcon size={20} color={currentTheme.colors.text} />
              ) : (
                <SunIcon size={20} color={currentTheme.colors.text} />
              )}
            </TouchableOpacity>
          </SettingRow>

          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                theme === 'light' && styles.themeOptionActive
              ]}
              onPress={() => changeTheme('light')}
            >
              <View style={[styles.themePreview, styles.lightThemePreview]}>
                <View style={styles.themePreviewHeader} />
                <View style={styles.themePreviewContent} />
              </View>
              <View style={styles.themeOptionTextContainer}>
                <SunIcon size={16} color={currentTheme.colors.text} />
                <Text style={[styles.themeOptionText, { color: currentTheme.colors.text }]}> Светлая</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                theme === 'dark' && styles.themeOptionActive
              ]}
              onPress={() => changeTheme('dark')}
            >
              <View style={[styles.themePreview, styles.darkThemePreview]}>
                <View style={styles.themePreviewHeader} />
                <View style={styles.themePreviewContent} />
              </View>
              <View style={styles.themeOptionTextContainer}>
                <MoonIcon size={16} color={currentTheme.colors.text} />
                <Text style={[styles.themeOptionText, { color: currentTheme.colors.text }]}> Тёмная</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                theme === 'corporate' && styles.themeOptionActive
              ]}
              onPress={() => changeTheme('corporate')}
            >
              <View style={[styles.themePreview, styles.corporateThemePreview]}>
                <View style={[styles.themePreviewHeader, { backgroundColor: '#1E3A8A' }]} />
                <View style={[styles.themePreviewContent, { backgroundColor: '#F8FAFC' }]} />
              </View>
              <View style={styles.themeOptionTextContainer}>
                <BuildingIcon size={16} color={currentTheme.colors.text} />
                <Text style={[styles.themeOptionText, { color: currentTheme.colors.text }]}> Корпоративная</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Уведомления */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.sectionCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeader}>
            <BellIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Уведомления</Text>
          </View>
          
          <SettingRow 
            label="Push-уведомления"
            description="Получать уведомления о важных событиях"
          >
            <Switch
              value={settings.notifications}
              onValueChange={(value) => handleSettingChange('notifications', value)}
              trackColor={{ false: '#767577', true: currentTheme.colors.primaryLight }}
              thumbColor={settings.notifications ? currentTheme.colors.primary : '#f4f3f4'}
            />
          </SettingRow>

          <SettingRow 
            label="Звук"
            description="Воспроизводить звук при уведомлениях"
          >
            <Switch
              value={settings.sound}
              onValueChange={(value) => handleSettingChange('sound', value)}
              trackColor={{ false: '#767577', true: currentTheme.colors.primaryLight }}
              thumbColor={settings.sound ? currentTheme.colors.primary : '#f4f3f4'}
            />
          </SettingRow>

          <SettingRow 
            label="Вибрация"
            description="Вибрация при получении уведомлений"
          >
            <Switch
              value={settings.vibrations}
              onValueChange={(value) => handleSettingChange('vibrations', value)}
              trackColor={{ false: '#767577', true: currentTheme.colors.primaryLight }}
              thumbColor={settings.vibrations ? currentTheme.colors.primary : '#f4f3f4'}
            />
          </SettingRow>
        </Animated.View>

        {/* Синхронизация данных */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.sectionCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeader}>
            <RefreshIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Синхронизация</Text>
          </View>
          
          <SettingRow 
            label="Автообновление"
            description="Автоматическое обновление данных"
          >
            <Switch
              value={settings.autoRefresh}
              onValueChange={(value) => handleSettingChange('autoRefresh', value)}
              trackColor={{ false: '#767577', true: currentTheme.colors.primaryLight }}
              thumbColor={settings.autoRefresh ? currentTheme.colors.primary : '#f4f3f4'}
            />
          </SettingRow>

          <View style={styles.settingSection}>
            <View style={styles.settingLabelContainer}>
              <SyncIcon size={18} color={currentTheme.colors.text} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}> Интервал синхронизации</Text>
            </View>
            <View style={styles.optionsRow}>
              {syncIntervals.map(interval => (
                <TouchableOpacity
                  key={interval.value}
                  style={[
                    styles.optionButton,
                    glassStyle(currentTheme),
                    settings.syncInterval === interval.value && [styles.optionButtonActive, { backgroundColor: currentTheme.colors.primary }]
                  ]}
                  onPress={() => handleSettingChange('syncInterval', interval.value)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: currentTheme.colors.text },
                    settings.syncInterval === interval.value && styles.optionTextActive
                  ]}>
                    {interval.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingSection}>
            <View style={styles.settingLabelContainer}>
              <StorageIcon size={18} color={currentTheme.colors.text} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}> Хранение данных</Text>
            </View>
            <View style={styles.optionsRow}>
              {dataRetentionOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    glassStyle(currentTheme),
                    settings.dataRetention === option.value && [styles.optionButtonActive, { backgroundColor: currentTheme.colors.primary }]
                  ]}
                  onPress={() => handleSettingChange('dataRetention', option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: currentTheme.colors.text },
                    settings.dataRetention === option.value && styles.optionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Настройки API */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.sectionCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeader}>
            <GlobeIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Интеграции API</Text>
          </View>
          
          {/* iiko */}
          <View style={styles.apiSection}>
            <View style={styles.apiHeader}>
              <View style={styles.apiNameContainer}>
                <SecurityIcon size={18} color={currentTheme.colors.text} />
                <Text style={[styles.apiName, { color: currentTheme.colors.text }]}> iiko</Text>
              </View>
              <TouchableOpacity 
                style={[styles.testButton, blueGlassStyle(currentTheme)]}
                onPress={() => testApiConnection('iiko')}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={currentTheme.colors.text} />
                ) : (
                  <View style={styles.testButtonContent}>
                    <TestIcon size={16} color={currentTheme.colors.text} />
                    <Text style={[styles.testButtonText, { color: currentTheme.colors.text }]}> Тест</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.apiInput, { 
                backgroundColor: currentTheme.colors.backgroundTertiary,
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text 
              }]}
              placeholder="API Key"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={apiConfig.iiko.apiKey}
              onChangeText={(text) => handleApiConfigChange('iiko', 'apiKey', text)}
              secureTextEntry
            />
            
            <TextInput
              style={[styles.apiInput, { 
                backgroundColor: currentTheme.colors.backgroundTertiary,
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text 
              }]}
              placeholder="Organization ID"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={apiConfig.iiko.organizationId}
              onChangeText={(text) => handleApiConfigChange('iiko', 'organizationId', text)}
            />
            
            <TextInput
              style={[styles.apiInput, { 
                backgroundColor: currentTheme.colors.backgroundTertiary,
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text 
              }]}
              placeholder="Base URL"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={apiConfig.iiko.baseUrl}
              onChangeText={(text) => handleApiConfigChange('iiko', 'baseUrl', text)}
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveApiButton, orangeGlassStyle(currentTheme)]}
            onPress={saveApiConfig}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={currentTheme.colors.text} />
            ) : (
              <View style={styles.saveApiButtonContent}>
                <SaveIcon size={18} color={currentTheme.colors.text} />
                <Text style={[styles.saveApiButtonText, { color: currentTheme.colors.text }]}> Сохранить настройки API</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Статус подключения */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.sectionCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeader}>
            <SatelliteIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Статус системы</Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: currentTheme.colors.text }]}>WebSocket подключение:</Text>
            <View style={[
              styles.statusIndicator,
              isWsConnected ? 
                [styles.statusConnected, { backgroundColor: currentTheme.colors.successLight }] : 
                [styles.statusDisconnected, { backgroundColor: currentTheme.colors.errorLight }]
            ]}>
              <View style={styles.statusContent}>
                {isWsConnected ? (
                  <ConnectedIcon size={16} color={currentTheme.colors.success} />
                ) : (
                  <DisconnectedIcon size={16} color={currentTheme.colors.error} />
                )}
                <Text style={[
                  styles.statusText,
                  { color: isWsConnected ? currentTheme.colors.success : currentTheme.colors.error }
                ]}>
                  {isWsConnected ? ' Подключено' : ' Отключено'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: currentTheme.colors.text }]}>Последняя синхронизация:</Text>
            <Text style={[styles.statusValue, { color: currentTheme.colors.textSecondary }]}>
              {new Date().toLocaleTimeString('ru-RU')}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: currentTheme.colors.text }]}>Версия приложения:</Text>
            <Text style={[styles.statusValue, { color: currentTheme.colors.textSecondary }]}>1.0.0</Text>
          </View>

          <TouchableOpacity 
            style={[styles.reconnectButton, blueGlassStyle(currentTheme)]}
            onPress={initializeRealTimeUpdates}
          >
            <View style={styles.reconnectButtonContent}>
              <RefreshIcon size={18} color={currentTheme.colors.text} />
              <Text style={[styles.reconnectButtonText, { color: currentTheme.colors.text }]}> Переподключиться</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Поддержка */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.sectionCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeader}>
            <PhoneIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Поддержка</Text>
          </View>
          
          <TouchableOpacity style={[styles.supportButton, glassStyle(currentTheme)]} onPress={openSupport}>
            <View style={styles.supportButtonContent}>
              <EmailIcon size={18} color={currentTheme.colors.text} />
              <Text style={[styles.supportButtonText, { color: currentTheme.colors.text }]}> Написать в поддержку</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.supportButton, glassStyle(currentTheme)]} onPress={openPrivacyPolicy}>
            <View style={styles.supportButtonContent}>
              <DocumentIcon size={18} color={currentTheme.colors.text} />
              <Text style={[styles.supportButtonText, { color: currentTheme.colors.text }]}> Политика конфиденциальности</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.supportButton, glassStyle(currentTheme)]} onPress={openTermsOfService}>
            <View style={styles.supportButtonContent}>
              <DocumentIcon size={18} color={currentTheme.colors.text} />
              <Text style={[styles.supportButtonText, { color: currentTheme.colors.text }]}> Условия использования</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Опасная зона */}
        <Animated.View 
          style={[
            glassStyle(currentTheme),
            styles.sectionCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeader}>
            <AlertIcon size={20} color={currentTheme.colors.text} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}> Опасная зона</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.dangerButton, orangeGlassStyle(currentTheme)]} 
            onPress={handleClearCache}
          >
            <View style={styles.dangerButtonContent}>
              <TrashIcon size={18} color={currentTheme.colors.text} />
              <Text style={[styles.dangerButtonText, { color: currentTheme.colors.text }]}> Очистить кэш</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dangerButton, blueGlassStyle(currentTheme)]} 
            onPress={handleLogout}
          >
            <View style={styles.dangerButtonContent}>
              <LogoutIcon size={18} color={currentTheme.colors.text} />
              <Text style={[styles.dangerButtonText, { color: currentTheme.colors.text }]}> Выйти из системы</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dangerButton, styles.deleteButton, glassStyle(currentTheme)]}
          >
            <View style={styles.dangerButtonContent}>
              <BanIcon size={18} color={currentTheme.colors.error} />
              <Text style={[styles.dangerButtonText, { color: currentTheme.colors.error }]}> Удалить аккаунт</Text>
            </View>
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
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingDescription: {
    fontSize: 12,
  },
  settingSection: {
    marginTop: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    // backgroundColor задается динамически
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  optionTextActive: {
    color: 'white',
  },
  apiSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  apiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  apiNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  testButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  apiInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  saveApiButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveApiButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveApiButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusConnected: {
    // backgroundColor задается динамически
  },
  statusDisconnected: {
    // backgroundColor задается динамически
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reconnectButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  reconnectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reconnectButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  supportButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  supportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dangerButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  dangerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpace: {
    height: 20,
  },
  // Новые стили для секции тем
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  themeOption: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  themeOptionActive: {
    borderColor: '#3498db',
  },
  themePreview: {
    width: 60,
    height: 40,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  lightThemePreview: {
    backgroundColor: '#f8f9fa',
  },
  darkThemePreview: {
    backgroundColor: '#1e1e1e',
  },
  corporateThemePreview: {
    backgroundColor: '#F8FAFC',
  },
  themePreviewHeader: {
    height: 12,
    backgroundColor: '#2c3e50',
  },
  themePreviewContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  themeOptionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SettingsScreen;