import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ArrowBackIcon } from '../IconSystem';

const SimpleCustomHeader = ({ 
  navigation, 
  title, 
  icon: Icon, 
  showBackButton = true,
  onBackPress 
}) => {
  const { currentTheme } = useTheme();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <View style={styles.content}>
        {/* Левая часть - кнопка назад */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <ArrowBackIcon 
                size={24} 
                color={currentTheme.colors.text} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Центральная часть - заголовок */}
        <View style={styles.centerSection}>
          <View style={styles.titleContainer}>
            {Icon && <Icon size={24} color={currentTheme.colors.text} />}
            <Text style={[styles.title, { color: currentTheme.colors.text }]}>
              {title}
            </Text>
          </View>
        </View>

        {/* Правая часть */}
        <View style={styles.rightSection}>
          <View style={styles.placeholder} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  placeholder: {
    width: 40,
  },
});

export default SimpleCustomHeader;