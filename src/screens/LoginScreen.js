// src/screens/LoginScreen.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Video } from 'expo-av';
import { useAuth } from '../context/AuthContext';
import { 
  UserIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon,
  LoginIcon 
} from '../components/IconSystem';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login, loading } = useAuth();
  const videoRef = useRef(null);

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [status, setStatus] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false
  });
  
  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    try {
      console.log('Attempting login with:', credentials);
      const result = await login(credentials.username, credentials.password);
      
      if (result.success) {
        console.log('Login completed successfully');
      } else {
        Alert.alert('Ошибка входа', result.error || 'Неверные учетные данные');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Ошибка входа', error.message || 'Произошла непредвиденная ошибка');
    }
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  // Альтернативный фон если видео не работает
  const renderBackground = () => {
    return (
      <View style={styles.fallbackBackground}>
        <Animated.View 
          style={[
            styles.animatedBackground,
            {
              backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['#1e3c72', '#2a5298']
              })
            }
          ]} 
        />
      </View>
    );
  };

  const getInputBorderColor = (field) => {
    if (isFocused[field]) {
      return 'rgba(255, 140, 0, 0.8)';
    }
    return 'rgba(255,255,255,0.3)';
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* Попытка загрузки видео с запасным вариантом */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require('../../assets/videos/auth-background.mp4')}
          style={styles.backgroundVideo}
          resizeMode="cover"
          shouldPlay
          isLooping
          isMuted
          onError={(error) => {
            console.log('Video error:', error);
            setStatus(prev => ({ ...prev, videoError: true }));
          }}
          onLoad={() => {
            console.log('Video loaded successfully');
            setStatus(prev => ({ ...prev, videoError: false }));
          }}
        />
        {/* Если видео не загрузилось, показываем градиент */}
        {status.videoError && renderBackground()}
      </View>
      
      {/* Затемнение */}
      <View style={styles.overlay} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim }
                ]
              }
            ]}
          >
            {/* Логотип и заголовок */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.mainTitle}>СНЕЖНЫЙ</Text>
                <Text style={styles.subTitle}>Панель администратора</Text>
              </View>
              
              <Text style={styles.description}>
                Профессиональное управление рестораном
              </Text>
            </View>

            {/* Форма входа */}
            <View style={styles.form}>
              <Text style={styles.formTitle}>
                Авторизация
              </Text>
              
              {/* Поле логина с улучшенным UX */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Имя пользователя</Text>
                  <View style={[
                    styles.inputWithIcon,
                    { borderColor: getInputBorderColor('username') }
                  ]}>
                    <UserIcon size={28} color={isFocused.username ? "white" : "muted"} />
                    <TextInput
                      style={styles.input}
                      placeholder="Введите имя пользователя"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={credentials.username}
                      onChangeText={(text) => setCredentials({...credentials, username: text})}
                      onFocus={() => handleFocus('username')}
                      onBlur={() => handleBlur('username')}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                    />
                  </View>
                </View>
              </View>

              {/* Поле пароля с переключателем видимости */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Пароль</Text>
                  <View style={[
                    styles.inputWithIcon,
                    { borderColor: getInputBorderColor('password') }
                  ]}>
                    <LockIcon size={28} color={isFocused.password ? "white" : "muted"} />
                    <TextInput
                      style={styles.input}
                      placeholder="Введите пароль"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={credentials.password}
                      onChangeText={(text) => setCredentials({...credentials, password: text})}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                    />
                    <TouchableOpacity 
                      style={styles.visibilityToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon size={28} color={isFocused.password ? "white" : "muted"} />
                      ) : (
                        <EyeIcon size={28} color={isFocused.password ? "white" : "muted"} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Основная кнопка входа */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <View style={styles.loginButtonContent}>
                    <LoginIcon size={24} color="white" />
                    <Text style={styles.loginButtonText}>
                      Войти в систему
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Дополнительные опции */}
              <View style={styles.helpContainer}>
                <TouchableOpacity style={styles.helpButton}>
                  <Text style={styles.helpText}>Забыли пароль?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.helpButton}>
                  <Text style={styles.helpText}>Помощь</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 RestaurantManager Pro
              </Text>
              <Text style={styles.versionText}>
                Версия 2.1.0
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
  fallbackBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  animatedBackground: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
    color: '#FF8C00',
    textShadowColor: 'white',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  form: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: 'white',
  },
  inputContainer: {
    marginBottom: 24, // Увеличили отступ
  },
  inputWrapper: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16, // Увеличили шрифт
    fontWeight: '600',
    marginBottom: 12, // Увеличили отступ
    marginLeft: 4,
    color: 'rgba(255,255,255,0.9)',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2, // Увеличили толщину границы
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16, // Увеличили радиус
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    height: 60, // Увеличили высоту поля ввода
    transition: 'border-color 0.3s ease',
  },
  input: {
    flex: 1,
    fontSize: 18, // Увеличили шрифт
    color: 'white',
    marginLeft: 12,
    paddingVertical: 8,
    height: '100%',
  },
  visibilityToggle: {
    paddingLeft: 8,
    padding: 8,
  },
  loginButton: {
    borderRadius: 16,
    paddingVertical: 18, // Увеличили высоту кнопки
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 140, 0, 0.9)',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: 'rgba(255, 140, 0, 0.5)',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  helpButton: {
    padding: 8,
  },
  helpText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
    color: 'rgba(255,255,255,0.6)',
  },
  versionText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
});

export default LoginScreen;