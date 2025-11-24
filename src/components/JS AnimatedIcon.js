import React, { useRef, useEffect } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';

const AnimatedIcon = ({
  type = 'ionicons',
  name,
  size = 24,
  color,
  animated = true,
  onPress,
  style
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const styles = useThemedStyles(staticStyles);

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, scaleAnim]);

  const handlePress = () => {
    if (onPress) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      onPress();
    }
  };

  const iconColor = color || styles.icon.color;

  const iconElement = type === 'feather' ? (
    <Feather name={name} size={size} color={iconColor} />
  ) : (
    <Ionicons name={name} size={size} color={iconColor} />
  );

  const animatedIcon = (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      {iconElement}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={handlePress} style={style}>
        {animatedIcon}
      </TouchableOpacity>
    );
  }

  return animatedIcon;
};

const staticStyles = theme => ({
  icon: {
    color: theme.text,
  },
});

export default AnimatedIcon;