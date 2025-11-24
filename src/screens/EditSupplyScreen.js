import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const AddSupplyScreen = ({ navigation }) => {
  const { addSupply, restaurants } = useApp();
  const { currentTheme } = useTheme();
  
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
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          Добавить поставку
        </Text>

        {/* Основная информация */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Основная информация
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Наименование товара *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: currentTheme.colors.card,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }
              ]}
              placeholder="Например: Помидоры"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Категория *
            </Text>
            <View style={[
              styles.pickerContainer,
              { 
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border
              }
            ]}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                style={[styles.picker, { color: currentTheme.colors.text }]}
                dropdownIconColor={currentTheme.colors.text}
              >
                <Picker.Item label="Выберите категорию" value="" />
                {categoryOptions.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Поставщик *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: currentTheme.colors.card,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }
              ]}
              placeholder="Например: ООО 'Фермерские продукты'"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={formData.supplier}
              onChangeText={(text) => setFormData(prev => ({ ...prev, supplier: text }))}
            />
          </View>
        </View>

        {/* Количество и единицы измерения */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Количество
          </Text>

          <View style={styles.quantityRow}>
            <View style={[styles.quantityInput, { flex: 2 }]}>
              <Text style={[styles.label, { color: currentTheme.colors.text }]}>
                Количество *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: currentTheme.colors.card,
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }
                ]}
                placeholder="0"
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={formData.quantity}
                onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text.replace(/[^0-9]/g, '') }))}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.unitInput, { flex: 1 }]}>
              <Text style={[styles.label, { color: currentTheme.colors.text }]}>
                Единица
              </Text>
              <View style={[
                styles.pickerContainer,
                { 
                  backgroundColor: currentTheme.colors.card,
                  borderColor: currentTheme.colors.border
                }
              ]}>
                <Picker
                  selectedValue={formData.unit}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                  style={[styles.picker, { color: currentTheme.colors.text }]}
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
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Назначение
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Ресторан *
            </Text>
            <View style={[
              styles.pickerContainer,
              { 
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border
              }
            ]}>
              <Picker
                selectedValue={formData.restaurantId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, restaurantId: value }))}
                style={[styles.picker, { color: currentTheme.colors.text }]}
                dropdownIconColor={currentTheme.colors.text}
              >
                <Picker.Item label="Выберите ресторан" value="" />
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
              <Text style={[styles.hint, { color: currentTheme.colors.textSecondary }]}>
                Выбран: {getRestaurantName(formData.restaurantId)}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Дата следующей поставки
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: currentTheme.colors.card,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }
              ]}
              placeholder="ГГГГ-ММ-ДД"
              placeholderTextColor={currentTheme.colors.textSecondary}
              value={formData.nextDelivery}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nextDelivery: text }))}
            />
            <Text style={[styles.hint, { color: currentTheme.colors.textSecondary }]}>
              Формат: 2024-01-31
            </Text>
          </View>
        </View>

        {/* Кнопки действий */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: currentTheme.colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
            <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
              {loading ? 'Добавление...' : 'Добавить поставку'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: currentTheme.colors.border }]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={[styles.cancelButtonText, { color: currentTheme.colors.text }]}>
              Отмена
            </Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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
  },
  actions: {
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddSupplyScreen;