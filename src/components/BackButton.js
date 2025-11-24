// src/components/BackButton.js
import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useIconColor } from '../hooks/useIconColor';
import useThemedIcons from '../hooks/useThemedIcons';

const BackButton = ({ 
  onPress, 
  style, 
  fallbackScreen = 'Dashboard',
  showLabel = false,
  label = 'Назад',
  ...props 
}) => {
  const navigation = useNavigation();
  const themedStyles = useThemedStyles(staticStyles);
  const iconColor = useIconColor('default');
  const { BackIcon } = useThemedIcons();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate(fallbackScreen);
      }
    }
  };

  return (
    <TouchableOpacity 
      style={[themedStyles.container, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
      {...props}
    >
      <View style={themedStyles.content}>
        <View style={themedStyles.iconContainer}>
          <BackIcon size={24} />
        </View>
        {showLabel && (
          <Text style={themedStyles.label}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const staticStyles = (theme) => StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: theme.colors?.card || 'rgba(0,0,0,0.05)',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors?.text || '#000000',
    fontWeight: '500',
  },
});

export default BackButton;