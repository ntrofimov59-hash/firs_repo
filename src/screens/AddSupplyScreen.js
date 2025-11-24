// src/screens/AddSupplyScreen.js
import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import ActionButton from '../components/ActionButton';
import BackButton from '../components/BackButton';
import { useThemedStyles } from '../hooks/useThemedStyles';

const AddSupplyScreen = ({ navigation }) => {
  const { addSupply, restaurants } = useApp();
  const { currentTheme } = useTheme();
  const themedStyles = useThemedStyles(staticStyles);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    supplier: '',
    quantity: '',
    unit: 'кг',
    restaurantId: '',
    nextDelivery: ''
  });

  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    'Овощи',
    'Фрукты',
    'Мясо',
    'Рыба',
    'Молочные продукты',
    'Крупы',
    'Макароны',
    'Специи',
    'Напитки',
    'Хлеб',
    'Сыры',
    'Морепродукты'
  ];

  const unitOptions = ['кг', 'г', 'л', 'мл', 'шт', 'уп'];

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

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.supplier || !formData.quantity || !formData.restaurantId) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    setLoading(true);
    try {
      const supplyData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        restaurantId: parseInt(formData.restaurantId)
      };

      addSupply(supplyData);
      
      Alert.alert('Успех', 'Поставка добавлена!', [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить поставку');
      console.error('Add supply error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
    return restaurant ? restaurant.name : 'Выберите ресторан';
  };

  return (
    <SafeAreaView style={themedStyles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={themedStyles.scrollView}>
        <View style={themedStyles.header}>
          <Text style={themedStyles.title}>
            Добавить поставку
          </Text>
        </View>

        {/* Основная информация */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>
            Основная информация
          </Text>

          <View style={themedStyles.inputContainer}>
            <TextInput
              style={themedStyles.input}
              placeholder="Наименование товара *"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          </View>

          <View style={themedStyles.inputContainer}>
            <View style={themedStyles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                style={themedStyles.picker}
                dropdownIconColor={currentTheme.colors.text}
              >
                <Picker.Item label="Выберите категорию *" value="" />
                {categoryOptions.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={themedStyles.inputContainer}>
            <TextInput
              style={themedStyles.input}
              placeholder="Поставщик *"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={formData.supplier}
              onChangeText={(text) => setFormData(prev => ({ ...prev, supplier: text }))}
            />
          </View>
        </View>

        {/* Количество и единицы измерения */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>
            Количество
          </Text>

          <View style={themedStyles.quantityRow}>
            <View style={[themedStyles.quantityInput, { flex: 2 }]}>
              <TextInput
                style={themedStyles.input}
                placeholder="Количество *"
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={formData.quantity}
                onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text.replace(/[^0-9]/g, '') }))}
                keyboardType="numeric"
              />
            </View>

            <View style={[themedStyles.unitInput, { flex: 1 }]}>
              <View style={themedStyles.pickerContainer}>
                <Picker
                  selectedValue={formData.unit}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                  style={themedStyles.picker}
                  dropdownIconColor={currentTheme.colors.text}
                >
                  {unitOptions.map((unit, index) => (
                    <Picker.Item key={index} label={unit} value={unit} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Ресторан и даты */}
        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>
            Назначение
          </Text>

          <View style={themedStyles.inputContainer}>
            <View style={themedStyles.pickerContainer}>
              <Picker
                selectedValue={formData.restaurantId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, restaurantId: value }))}
                style={themedStyles.picker}
                dropdownIconColor={currentTheme.colors.text}
              >
                <Picker.Item label="Выберите ресторан *" value="" />
                {restaurants.map(restaurant => (
                  <Picker.Item 
                    key={restaurant.id} 
                    label={restaurant.name} 
                    value={restaurant.id.toString()} 
                  />
                ))}
              </Picker>
            </View>
            {formData.restaurantId && (
              <Text style={themedStyles.hint}>
                Выбран: {getRestaurantName(formData.restaurantId)}
              </Text>
            )}
          </View>

          <View style={themedStyles.inputContainer}>
            <TextInput
              style={themedStyles.input}
              placeholder="Дата следующей поставки (ГГГГ-ММ-ДД)"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={formData.nextDelivery}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nextDelivery: text }))}
            />
          </View>
        </View>

        {/* Кнопки действий */}
        <View style={themedStyles.actions}>
          <ActionButton
            onPress={handleSubmit}
            iconName="add"
            label={loading ? 'Добавление...' : 'Добавить поставку'}
            variant="primary"
            size="large"
            loading={loading}
            disabled={loading}
            fullWidth
            style={themedStyles.submitButton}
          />

          <ActionButton
            onPress={() => navigation.goBack()}
            iconName="close"
            label="Отмена"
            variant="outline"
            size="large"
            disabled={loading}
            fullWidth
            style={themedStyles.cancelButton}
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
    padding: 20,
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors?.border || '#e0e0e0',
    paddingBottom: 5,
    color: theme.colors?.text || theme.text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: theme.colors?.card || 'rgba(255,255,255,0.1)',
    borderColor: theme.colors?.border || '#e0e0e0',
    color: theme.colors?.text || theme.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors?.card || 'rgba(255,255,255,0.1)',
    borderColor: theme.colors?.border || '#e0e0e0',
  },
  picker: {
    height: 50,
    color: theme.colors?.text || theme.text,
  },
  quantityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quantityInput: {
    // flex: 2
  },
  unitInput: {
    // flex: 1
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
    color: theme.colors?.textSecondary || theme.text,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  submitButton: {
    borderRadius: 12,
  },
  cancelButton: {
    borderRadius: 12,
  },
  backButton: {
    marginLeft: 8,
  },
});

export default AddSupplyScreen;