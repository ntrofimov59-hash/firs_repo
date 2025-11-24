import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import ScreenLayout from '../components/JS ScreenLayout';
import ActionButton from '../components/ActionButton';
import { EmployeesIcon } from '../components/IconSystem';

const EmployeeManagementScreen = ({ navigation }) => {
  const { employees, restaurants, deleteEmployee, updateEmployee } = useApp();
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const styles = useThemedStyles(staticStyles);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Неизвестно';
  };

  const handleDeleteEmployee = (employeeId, employeeName) => {
    Alert.alert(
      'Удаление сотрудника',
      `Вы уверены, что хотите удалить сотрудника ${employeeName}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => deleteEmployee(employeeId)
        }
      ]
    );
  };

  const handleToggleStatus = (employee) => {
    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    updateEmployee(employee.id, { status: newStatus });
  };

  return (
    <ScreenLayout
      title="Управление сотрудниками"
      icon={EmployeesIcon}
      onFabPress={() => navigation.navigate('AddEmployee')}
      fabIconName="person-add"
      onBackPress={() => navigation.goBack()}
    >
      {/* Поиск */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: currentTheme.colors.card,
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text
            }
          ]}
          placeholder="Поиск сотрудников..."
          placeholderTextColor={currentTheme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialCommunityIcons 
          name="magnify" 
          size={20} 
          color={currentTheme.colors.textSecondary}
          style={styles.searchIcon}
        />
      </View>

      {/* Список сотрудников */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredEmployees.map(employee => (
          <View 
            key={employee.id} 
            style={[
              styles.employeeCard,
              { backgroundColor: currentTheme.colors.card }
            ]}
          >
            <View style={styles.employeeHeader}>
              <View style={styles.employeeInfo}>
                <View style={styles.employeeNameRow}>
                  <MaterialCommunityIcons 
                    name={employee.image || 'account'} 
                    size={24} 
                    color={currentTheme.colors.primary}
                    style={styles.employeeAvatar}
                  />
                  <Text style={[styles.employeeName, { color: currentTheme.colors.text }]}>
                    {employee.name}
                  </Text>
                </View>
                <Text style={[styles.employeePosition, { color: currentTheme.colors.textSecondary }]}>
                  {employee.position}
                </Text>
                <View style={styles.restaurantRow}>
                  <MaterialCommunityIcons name="store" size={14} color={currentTheme.colors.textSecondary} />
                  <Text style={[styles.restaurantName, { color: currentTheme.colors.textSecondary, marginLeft: 4 }]}>
                    {getRestaurantName(employee.restaurantId)}
                  </Text>
                </View>
              </View>
              
              <View style={[
                styles.statusBadge,
                { backgroundColor: employee.status === 'active' ? currentTheme.colors.success : currentTheme.colors.error }
              ]}>
                <MaterialCommunityIcons 
                  name={employee.status === 'active' ? 'check-circle' : 'close-circle'} 
                  size={12} 
                  color="white"
                />
                <Text style={[styles.statusText, { marginLeft: 4 }]}>
                  {employee.status === 'active' ? 'Активен' : 'Неактивен'}
                </Text>
              </View>
            </View>

            <View style={styles.employeeDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="email" size={14} color={currentTheme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: currentTheme.colors.textSecondary, marginLeft: 6 }]}>
                  {employee.email}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="phone" size={14} color={currentTheme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: currentTheme.colors.textSecondary, marginLeft: 6 }]}>
                  {employee.phone}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="cash" size={14} color={currentTheme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: currentTheme.colors.textSecondary, marginLeft: 6 }]}>
                  {employee.salary?.toLocaleString()} ₽
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: currentTheme.colors.primary }]}
                onPress={() => navigation.navigate('EditEmployee', { employee })}
              >
                <MaterialCommunityIcons name="pencil" size={14} color="white" />
                <Text style={[styles.actionButtonText, { marginLeft: 4 }]}>
                  Редактировать
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { 
                  backgroundColor: employee.status === 'active' ? currentTheme.colors.warning : currentTheme.colors.success 
                }]}
                onPress={() => handleToggleStatus(employee)}
              >
                <MaterialCommunityIcons 
                  name={employee.status === 'active' ? 'pause' : 'play'} 
                  size={14} 
                  color="white" 
                />
                <Text style={[styles.actionButtonText, { marginLeft: 4 }]}>
                  {employee.status === 'active' ? 'Деактивировать' : 'Активировать'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: currentTheme.colors.error }]}
                onPress={() => handleDeleteEmployee(employee.id, employee.name)}
              >
                <MaterialCommunityIcons name="delete" size={14} color="white" />
                <Text style={[styles.actionButtonText, { marginLeft: 4 }]}>
                  Удалить
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredEmployees.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group" size={40} color={currentTheme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: currentTheme.colors.textSecondary }]}>
              {searchQuery ? 'Сотрудники не найдены' : 'Нет сотрудников'}
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

const staticStyles = theme => ({
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 30,
    top: 12,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  employeeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  employeeAvatar: {
    marginRight: 8,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  employeePosition: {
    fontSize: 14,
    marginBottom: 2,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  employeeDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default EmployeeManagementScreen;