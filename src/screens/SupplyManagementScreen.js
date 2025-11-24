import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import ScreenLayout from '../components/JS ScreenLayout';
import { SupplyIcon } from '../components/JS ScreenIcons';

const SupplyManagementScreen = ({ navigation }) => {
  const { supplies, restaurants, deleteSupply, updateSupply } = useApp();
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSupplies = supplies.filter(supply => {
    const matchesSearch = supply.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supply.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || supply.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Неизвестно';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return currentTheme.colors.success;
      case 'in_transit': return currentTheme.colors.warning;
      case 'pending': return currentTheme.colors.error;
      default: return currentTheme.colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Доставлено';
      case 'in_transit': return 'В пути';
      case 'pending': return 'Ожидает';
      default: return status;
    }
  };

  const handleDeleteSupply = (supplyId, supplyName) => {
    Alert.alert(
      'Удаление поставки',
      `Вы уверены, что хотите удалить поставку "${supplyName}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => deleteSupply(supplyId)
        }
      ]
    );
  };

  const handleUpdateStatus = (supply, newStatus) => {
    updateSupply(supply.id, { status: newStatus });
  };

  const renderContent = () => (
    <>
      {/* Поиск и фильтры */}
      <View style={styles.filtersContainer}>
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
            placeholder="Поиск поставок..."
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statusFilters}
        >
          {['all', 'delivered', 'in_transit', 'pending'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusFilter,
                filterStatus === status ? 
                  [styles.statusFilterActive, { backgroundColor: currentTheme.colors.primary }] : 
                  { backgroundColor: currentTheme.colors.card }
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                styles.statusFilterText,
                filterStatus === status ? 
                  styles.statusFilterTextActive : 
                  { color: currentTheme.colors.text }
              ]}>
                {status === 'all' ? 'Все' : getStatusText(status)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredSupplies.map(supply => (
          <View 
            key={supply.id} 
            style={[
              styles.supplyCard,
              { backgroundColor: currentTheme.colors.card }
            ]}
          >
            <View style={styles.supplyHeader}>
              <View style={styles.supplyInfo}>
                <Text style={[styles.supplyName, { color: currentTheme.colors.text }]}>
                  {supply.name}
                </Text>
                <Text style={[styles.supplyCategory, { color: currentTheme.colors.textSecondary }]}>
                  {supply.category} • {getRestaurantName(supply.restaurantId)}
                </Text>
                <Text style={[styles.supplier, { color: currentTheme.colors.textSecondary }]}>
                  📦 {supply.supplier}
                </Text>
              </View>
              
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(supply.status) }
              ]}>
                <Text style={styles.statusText}>
                  {getStatusText(supply.status)}
                </Text>
              </View>
            </View>

            <View style={styles.supplyDetails}>
              <View style={styles.quantitySection}>
                <Text style={[styles.quantity, { color: currentTheme.colors.text }]}>
                  {supply.quantity} {supply.unit}
                </Text>
                <Text style={[styles.quantityLabel, { color: currentTheme.colors.textSecondary }]}>
                  Количество
                </Text>
              </View>

              <View style={styles.datesSection}>
                <Text style={[styles.date, { color: currentTheme.colors.textSecondary }]}>
                  📅 Последняя: {supply.lastDelivery}
                </Text>
                <Text style={[styles.date, { color: currentTheme.colors.textSecondary }]}>
                  🚚 Следующая: {supply.nextDelivery}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: currentTheme.colors.primary }]}
                onPress={() => navigation.navigate('EditSupply', { supply })}
              >
                <Text style={styles.actionButtonText}>✏️ Редактировать</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: currentTheme.colors.warning }]}
                onPress={() => {
                  const newStatus = supply.status === 'delivered' ? 'pending' : 'delivered';
                  handleUpdateStatus(supply, newStatus);
                }}
              >
                <Text style={styles.actionButtonText}>
                  {supply.status === 'delivered' ? '⏪ Вернуть' : '✅ Доставлено'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: currentTheme.colors.error }]}
                onPress={() => handleDeleteSupply(supply.id, supply.name)}
              >
                <Text style={styles.actionButtonText}>🗑️ Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredSupplies.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: currentTheme.colors.textSecondary }]}>
              {searchQuery || filterStatus !== 'all' ? 'Поставки не найдены' : 'Нет поставок'}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );

  return (
    <ScreenLayout
      title="Управление поставками"
      icon={SupplyIcon}
      navigation={navigation}
      onFabPress={() => navigation.navigate('AddSupply')}
      fabIcon="package"
      fabIconType="feather"
    >
      {renderContent()}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  statusFilters: {
    marginBottom: 10,
  },
  statusFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  statusFilterActive: {
    // backgroundColor задается динамически
  },
  statusFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusFilterTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  supplyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supplyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  supplyInfo: {
    flex: 1,
  },
  supplyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  supplyCategory: {
    fontSize: 14,
    marginBottom: 2,
  },
  supplier: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  supplyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  quantitySection: {
    alignItems: 'center',
  },
  quantity: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  quantityLabel: {
    fontSize: 12,
  },
  datesSection: {
    flex: 1,
    marginLeft: 20,
  },
  date: {
    fontSize: 12,
    marginBottom: 2,
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
  },
});

export default SupplyManagementScreen;