// src/hooks/useThemedIcons.js
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useIconColor } from './useIconColor';

// Простой хук для тематических иконок
const useThemedIcons = () => {
  const getIconColor = useIconColor;

  // Базовые иконки с автоматическим цветом
  const createThemedIcon = (iconName, defaultType = 'default') => {
    return (props) => {
      const { colorType = defaultType, size = 24, ...rest } = props;
      const color = getIconColor(colorType);
      return <Ionicons name={iconName} size={size} color={color} {...rest} />;
    };
  };

  // Мемоизированный набор иконок
  const themedIcons = useMemo(() => {
    return {
      // Основные иконки
      AddIcon: createThemedIcon('add', 'primary'),
      EditIcon: createThemedIcon('create', 'primary'),
      DeleteIcon: createThemedIcon('trash', 'error'),
      SaveIcon: createThemedIcon('save', 'primary'),
      CancelIcon: createThemedIcon('close', 'default'),
      
      // Навигационные иконки
      BackIcon: createThemedIcon('arrow-back', 'default'),
      ForwardIcon: createThemedIcon('arrow-forward', 'default'),
      MenuIcon: createThemedIcon('menu', 'default'),
      
      // Действия
      SearchIcon: createThemedIcon('search', 'default'),
      FilterIcon: createThemedIcon('filter', 'default'),
      SettingsIcon: createThemedIcon('settings', 'default'),
      NotificationsIcon: createThemedIcon('notifications', 'default'),
      
      // Пользовательские
      UserIcon: createThemedIcon('person', 'default'),
      ProfileIcon: createThemedIcon('person-circle', 'default'),
      EmailIcon: createThemedIcon('mail', 'default'),
      PhoneIcon: createThemedIcon('call', 'default'),
      
      // Бизнес
      RestaurantIcon: createThemedIcon('restaurant', 'primary'),
      MoneyIcon: createThemedIcon('cash', 'default'),
      AnalyticsIcon: createThemedIcon('analytics', 'primary'),
      
      // Состояния
      SuccessIcon: createThemedIcon('checkmark-circle', 'success'),
      ErrorIcon: createThemedIcon('close-circle', 'error'),
      WarningIcon: createThemedIcon('warning', 'warning'),
      InfoIcon: createThemedIcon('information-circle', 'primary'),
    };
  }, [getIconColor]);

  return themedIcons;
};

export default useThemedIcons;