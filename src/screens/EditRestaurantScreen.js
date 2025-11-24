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
  StatusBar,
  Switch
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const EditRestaurantScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const { updateRestaurant, deleteRestaurant } = useApp();
  const { currentTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    description: '',
    isOpen: false
  });

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        category: restaurant.category || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        openingHours: restaurant.openingHours || '',
        description: restaurant.description || '',
        isOpen: restaurant.isOpen || false
      });
    }
  }, [restaurant]);

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.address) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните обязательные поля');
      return;
    }

    updateRestaurant(restaurant.id, formData);
    Alert.alert('Успех', 'Ресторан обновлен!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление ресторана',
      'Вы уверены, что хотите удалить этот ресторан? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            deleteRestaurant(restaurant.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          {restaurant ? 'Редактировать ресторан' : 'Добавить ресторан'}
        </Text>

        {['name', 'category', 'address', 'phone', 'email', 'openingHours'].map((field) => (
          <View key={field} style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.text }]}>
              {{
                name: 'Название ресторана *',
                category: 'Категория *',
                address: 'Адрес *',
                phone: 'Телефон',
                email: 'Email',
                openingHours: 'Часы работы'
              }[field]}
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
              value={formData[field]}
              onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
            />
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: currentTheme.colors.text }]}>Описание</Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }
            ]}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={[styles.label, { color: currentTheme.colors.text }]}>Ресторан открыт</Text>
          <Switch
            value={formData.isOpen}
            onValueChange={(value) => setFormData(prev => ({ ...prev, isOpen: value }))}
            trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: currentTheme.colors.primary }]}
          onPress={handleSubmit}
        >
          <MaterialCommunityIcons name="content-save" size={20} color="white" />
          <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
            {restaurant ? 'Обновить ресторан' : 'Добавить ресторан'}
          </Text>
        </TouchableOpacity>

        {restaurant && (
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: currentTheme.colors.error }]}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="delete" size={20} color="white" />
            <Text style={[styles.deleteButtonText, { marginLeft: 8 }]}>
              Удалить ресторан
            </Text>
          </TouchableOpacity>
        )}
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
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
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
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditRestaurantScreen;