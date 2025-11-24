import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';

const DashboardCard = ({ title, value, subtitle, icon: IconComponent, onPress, color }) => {
  const styles = useThemedStyles(staticStyles);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Легкая пульсация при монтировании
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    // Анимация при нажатии
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View 
        style={[
          styles.card, 
          { backgroundColor: color || styles.card.backgroundColor },
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {IconComponent && (
            <View style={styles.iconContainer}>
              <IconComponent size={32} color="#FFFFFF" animated={true} />
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const staticStyles = theme => StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    backgroundColor: theme.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  iconContainer: {
    marginLeft: 16,
  },
});

export default DashboardCard;