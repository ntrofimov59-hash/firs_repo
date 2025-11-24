import React, { useState, useEffect } from 'react';
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

const EditEmployeeScreen = ({ route, navigation }) => {
  const { employee } = route.params;
  const { updateEmployee, deleteEmployee, restaurants } = useApp();
  const { currentTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    restaurantId: '',
    salary: '',
    image: 'account'
  });

  const [loading, setLoading] = useState(false);

  const positionOptions = [
    'Менеджер',
    'Шеф-повар',
    'Повар',
    'Официант',
    'Бармен',
    'Бариста',
    'Уборщик',
    'Охранник',
    'Администратор',
    'Бухгалтер'
  ];

  const imageOptions = [
    { icon: 'account', label: 'Мужчина офис' },
    { icon: 'account-outline', label: 'Женщина офис' },
    { icon: 'chef-hat', label: 'Мужчина повар' },
    { icon: 'chef-hat', label: 'Женщина повар' },
    { icon: 'account-hard-hat', label: 'Мужчина техник' },
    { icon: 'account-hard-hat', label: 'Женщина техник' },
    { icon: 'account-supervisor', label: 'Мужчина помощь' },
    { icon: 'account-supervisor-outline', label: 'Женщина помощь' }
  ];

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        position: employee.position || '',
        email: employee.email || '',
        phone: employee.phone || '',
        restaurantId: employee.restaurantId?.toString() || '',
        salary: employee.salary?.toString() || '',
        image: employee.image || 'account'
      });
    }
  }, [employee]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.position || !formData.restaurantId) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните обязательные поля');
      return;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный email');
      return;
    }

    setLoading(true);
    try {
      const employeeData = {
        ...formData,
        salary: formData.salary ? parseInt(formData.salary) : 0,
        restaurantId: parseInt(formData.restaurantId)
      };

      updateEmployee(employee.id, employeeData);
      
      Alert.alert('Успех', 'Данные сотрудника обновлены!', [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить данные сотрудника');
      console.error('Update employee error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление сотрудника',
      `Вы уверены, что хотите удалить сотрудника ${employee.name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            deleteEmployee(employee.id);
            navigation.goBack();
          }
        }
      ]
    );
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
          Редактировать сотрудника
        </Text>

        {/* Основная информация */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Основная информация
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              ФИО сотрудника *
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
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Должность *
            </Text>
            <View style={[
              styles.pickerContainer,
              { 
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border
              }
            ]}>
              <Picker
                selectedValue={formData.position}
                onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
                style={[styles.picker, { color: currentTheme.colors.text }]}
                dropdownIconColor={currentTheme.colors.text}
              >
                <Picker.Item label="Выберите должность" value="" />
                {positionOptions.map((position, index) => (
                  <Picker.Item key={index} label={position} value={position} />
                ))}
              </Picker>
            </View>
          </View>

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
        </View>

        {/* Контактная информация */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Контактная информация
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Email
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
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Телефон
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
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Финансовая информация */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Финансовая информация
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              Зарплата (руб)
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
              value={formData.salary}
              onChangeText={(text) => setFormData(prev => ({ ...prev, salary: text.replace(/[^0-9]/g, '') }))}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Аватар */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Выберите аватар
          </Text>
          
          <View style={styles.avatarGrid}>
            {imageOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarOption,
                  { 
                    backgroundColor: formData.image === option.icon 
                      ? currentTheme.colors.primary 
                      : currentTheme.colors.card,
                    borderColor: currentTheme.colors.border
                  }
                ]}
                onPress={() => setFormData(prev => ({ ...prev, image: option.icon }))}
              >
                <MaterialCommunityIcons 
                  name={option.icon} 
                  size={24} 
                  color={formData.image === option.icon ? 'white' : currentTheme.colors.text} 
                />
                <Text style={[
                  styles.avatarLabel,
                  { color: formData.image === option.icon ? 'white' : currentTheme.colors.text }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Кнопки действий */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: currentTheme.colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <MaterialCommunityIcons name="content-save" size={20} color="white" />
            <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: currentTheme.colors.error }]}
            onPress={handleDelete}
            disabled={loading}
          >
            <MaterialCommunityIcons name="delete" size={20} color="white" />
            <Text style={[styles.deleteButtonText, { marginLeft: 8 }]}>
              Удалить сотрудника
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
  hint: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatarLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
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
  deleteButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
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

export default EditEmployeeScreen;