import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import ScreenLayout from '../components/JS ScreenLayout';
import SimpleCustomHeader from '../components/Navigation/CustomHeader';
import SimpleActionButton from '../components/ActionButton';
import { 
  UserIcon,
  EmailIcon,
  PhoneIcon,
  MoneyIcon,
  RestaurantIcon,
  AddIcon,
  CancelIcon
} from '../components/IconSystem';
import { glassStyle } from '../styles/themes';

const AddEmployeeScreen = ({ navigation }) => {
  const { addEmployee, restaurants } = useApp();
  const { currentTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    restaurantId: '',
    salary: '',
    image: '👨‍💼'
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
    { emoji: '👨‍💼', label: 'Мужчина офис' },
    { emoji: '👩‍💼', label: 'Женщина офис' },
    { emoji: '👨‍🍳', label: 'Мужчина повар' },
    { emoji: '👩‍🍳', label: 'Женщина повар' },
    { emoji: '👨‍🔧', label: 'Мужчина техник' },
    { emoji: '👩‍🔧', label: 'Женщина техник' },
    { emoji: '💁‍♂️', label: 'Мужчина помощь' },
    { emoji: '💁‍♀️', label: 'Женщина помощь' }
  ];

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

      addEmployee(employeeData);
      
      Alert.alert('Успех', 'Сотрудник добавлен!', [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить сотрудника');
      console.error('Add employee error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
    return restaurant ? restaurant.name : 'Выберите ресторан';
  };

  return (
    <View style={styles.fullContainer}>
      {/* Кастомный хедер */}
      <SimpleCustomHeader
        navigation={navigation}
        title="Добавить сотрудника"
        icon={UserIcon}
      />
      
      {/* Основной контент с ScreenLayout */}
      <ScreenLayout 
        scrollable={true}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.content}>
          {/* Основная информация */}
          <View style={[styles.section, glassStyle(currentTheme)]}>
            <View style={styles.sectionHeader}>
              <UserIcon size={20} color={currentTheme.colors.text} />
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Основная информация
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={[
                styles.inputWithIcon,
                { 
                  backgroundColor: currentTheme.colors.card,
                  borderColor: currentTheme.colors.border,
                }
              ]}>
                <UserIcon size={20} color={currentTheme.colors.textSecondary} />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: currentTheme.colors.text
                    }
                  ]}
                  placeholder="ФИО сотрудника *"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
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
                  <Picker.Item label="Выберите должность *" value="" />
                  {positionOptions.map((position, index) => (
                    <Picker.Item key={index} label={position} value={position} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
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
                <Text style={[styles.hint, { color: currentTheme.colors.textSecondary }]}>
                  Выбран: {getRestaurantName(formData.restaurantId)}
                </Text>
              )}
            </View>
          </View>

          {/* Контактная информация */}
          <View style={[styles.section, glassStyle(currentTheme)]}>
            <View style={styles.sectionHeader}>
              <EmailIcon size={20} color={currentTheme.colors.text} />
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Контактная информация
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={[
                styles.inputWithIcon,
                { 
                  backgroundColor: currentTheme.colors.card,
                  borderColor: currentTheme.colors.border,
                }
              ]}>
                <EmailIcon size={20} color={currentTheme.colors.textSecondary} />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: currentTheme.colors.text
                    }
                  ]}
                  placeholder="Email"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={[
                styles.inputWithIcon,
                { 
                  backgroundColor: currentTheme.colors.card,
                  borderColor: currentTheme.colors.border,
                }
              ]}>
                <PhoneIcon size={20} color={currentTheme.colors.textSecondary} />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: currentTheme.colors.text
                    }
                  ]}
                  placeholder="Телефон"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Финансовая информация */}
          <View style={[styles.section, glassStyle(currentTheme)]}>
            <View style={styles.sectionHeader}>
              <MoneyIcon size={20} color={currentTheme.colors.text} />
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Финансовая информация
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={[
                styles.inputWithIcon,
                { 
                  backgroundColor: currentTheme.colors.card,
                  borderColor: currentTheme.colors.border,
                }
              ]}>
                <MoneyIcon size={20} color={currentTheme.colors.textSecondary} />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: currentTheme.colors.text
                    }
                  ]}
                  placeholder="Зарплата (руб)"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={formData.salary}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, salary: text.replace(/[^0-9]/g, '') }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Аватар */}
          <View style={[styles.section, glassStyle(currentTheme)]}>
            <View style={styles.sectionHeader}>
              <UserIcon size={20} color={currentTheme.colors.text} />
              <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
                Выберите аватар
              </Text>
            </View>
            
            <View style={styles.avatarGrid}>
              {imageOptions.map((option, index) => (
                <View key={index} style={styles.avatarOptionContainer}>
                  <SimpleActionButton
                    title={option.emoji}
                    onPress={() => setFormData(prev => ({ ...prev, image: option.emoji }))}
                    variant={formData.image === option.emoji ? 'primary' : 'secondary'}
                    style={[
                      styles.avatarButton,
                      formData.image === option.emoji && styles.selectedAvatar
                    ]}
                  />
                  <Text style={[styles.avatarLabel, { color: currentTheme.colors.textSecondary }]}>
                    {option.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Кнопки действий */}
          <View style={styles.actions}>
            <SimpleActionButton
              title={loading ? 'Добавление...' : 'Добавить сотрудника'}
              onPress={handleSubmit}
              icon={AddIcon}
              variant="primary"
              disabled={loading}
              style={styles.submitButton}
            />

            <SimpleActionButton
              title="Отмена"
              onPress={() => navigation.goBack()}
              icon={CancelIcon}
              variant="secondary"
              disabled={loading}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScreenLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
  },
  content: {
    gap: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    marginLeft: 8,
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
  avatarOptionContainer: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAvatar: {
    borderWidth: 3,
    borderColor: '#FF8C00',
  },
  avatarLabel: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginTop: 10,
  },
  submitButton: {
    borderRadius: 12,
  },
  cancelButton: {
    borderRadius: 12,
  },
});

export default AddEmployeeScreen;