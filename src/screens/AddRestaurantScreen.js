// src/screens/AddRestaurantScreen.js
import React, { useState, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { RestaurantValidators, useValidation } from '../utils/validators';
import errorHandler from '../utils/errorHandler';
import ActionButton from '../components/ActionButton';
import BackButton from '../components/BackButton';
import { useThemedStyles } from '../hooks/useThemedStyles';

const AddRestaurantScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const themedStyles = useThemedStyles(staticStyles);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    category: 'Вверх',
    capacity: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  const {
    errors,
    touched,
    validateField,
    validateForm,
    markFieldAsTouched,
    resetValidation,
    hasErrors
  } = useValidation();

  // Настройка заголовка с кнопкой назад
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton 
          onPress={() => navigation.goBack()}
          style={themedStyles.backButton}
        />
      ),
    });
  }, [navigation]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Валидация в реальном времени после первого касания
    if (touched[field]) {
      validateField(field, value, getValidator(field));
    }
  };

  const handleBlur = (field) => {
    markFieldAsTouched(field);
    validateField(field, formData[field], getValidator(field));
  };

  const getValidator = (field) => {
    const validators = {
      name: RestaurantValidators.name,
      address: RestaurantValidators.address,
      phone: RestaurantValidators.phone,
      category: RestaurantValidators.category,
      capacity: RestaurantValidators.capacity
    };
    return validators[field];
  };

  const handleSubmit = async () => {
    // Проверяем все поля
    const fieldsToValidate = {
      name: { value: formData.name, validator: RestaurantValidators.name },
      address: { value: formData.address, validator: RestaurantValidators.address },
      phone: { value: formData.phone, validator: RestaurantValidators.phone },
      category: { value: formData.category, validator: RestaurantValidators.category },
      capacity: { value: formData.capacity, validator: RestaurantValidators.capacity }
    };

    const isValid = validateForm(fieldsToValidate);

    if (!isValid) {
      Alert.alert('Ошибка валидации', 'Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setLoading(true);

    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 10% вероятность ошибки для тестирования
      if (Math.random() < 0.1) {
        throw new Error('Failed to create restaurant: Database connection timeout');
      }

      // Успешное создание
      Alert.alert(
        'Успех!', 
        'Ресторан успешно создан',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      const userError = errorHandler.handleApiError(error, 'restaurant_create');
      
      Alert.alert('Ошибка', userError.message);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={themedStyles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={themedStyles.scrollView}>
        <View style={themedStyles.header}>
          <Text style={themedStyles.title}>Новый ресторан</Text>
        </View>

        <View style={themedStyles.form}>
          {/* Поле названия */}
          <View style={themedStyles.field}>
            <View style={themedStyles.inputWithIcon}>
              <TextInput
                style={[
                  themedStyles.input, 
                  { 
                    borderColor: errors.name ? currentTheme.colors.error : currentTheme.colors.border
                  }
                ]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                onBlur={() => handleBlur('name')}
                placeholder="Название ресторана *"
                placeholderTextColor={currentTheme.colors.textSecondary}
              />
            </View>
            {errors.name && (
              <Text style={themedStyles.errorText}>
                {errors.name}
              </Text>
            )}
          </View>

          {/* Поле адреса */}
          <View style={themedStyles.field}>
            <View style={themedStyles.inputWithIcon}>
              <TextInput
                style={[
                  themedStyles.input, 
                  { 
                    borderColor: errors.address ? currentTheme.colors.error : currentTheme.colors.border
                  }
                ]}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                onBlur={() => handleBlur('address')}
                placeholder="Адрес ресторана *"
                placeholderTextColor={currentTheme.colors.textSecondary}
              />
            </View>
            {errors.address && (
              <Text style={themedStyles.errorText}>
                {errors.address}
              </Text>
            )}
          </View>

          {/* Поле телефона */}
          <View style={themedStyles.field}>
            <View style={themedStyles.inputWithIcon}>
              <TextInput
                style={[
                  themedStyles.input, 
                  { 
                    borderColor: errors.phone ? currentTheme.colors.error : currentTheme.colors.border
                  }
                ]}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                onBlur={() => handleBlur('phone')}
                placeholder="Телефон * (+7 XXX XXX-XX-XX)"
                placeholderTextColor={currentTheme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && (
              <Text style={themedStyles.errorText}>
                {errors.phone}
              </Text>
            )}
          </View>

          {/* Кнопка отправки */}
          <ActionButton
            onPress={handleSubmit}
            iconName="restaurant"
            label={loading ? 'Создание...' : 'Создать ресторан'}
            variant="primary"
            size="large"
            loading={loading}
            disabled={hasErrors || loading}
            fullWidth
            style={themedStyles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const staticStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background || theme.background,
  },
  scrollView: {
    flex: 1,
    padding: 20
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors?.text || theme.text,
  },
  form: {
    gap: 20
  },
  field: {
    gap: 8
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: theme.colors?.card || 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors?.text || theme.text,
    borderWidth: 0,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    marginTop: 4,
    color: theme.colors?.error || '#DC3545',
  },
  submitButton: {
    marginTop: 20
  },
  backButton: {
    marginLeft: 8,
  },
});

export default AddRestaurantScreen;