import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SimpleActionButton = ({
  title,
  onPress,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const { currentTheme } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return currentTheme.colors.primary;
      case 'secondary':
        return currentTheme.colors.secondary;
      case 'danger':
        return currentTheme.colors.error;
      default:
        return currentTheme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {Icon && <Icon size={20} color="#FFFFFF" style={styles.icon} />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 44,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default SimpleActionButton;