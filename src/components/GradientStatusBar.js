// src/components/GradientStatusBar.js
import React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const GradientStatusBar = () => {
  const { currentTheme } = useTheme();
  
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

  return (
    <>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={{
        height: statusBarHeight,
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 999
      }}>
        <LinearGradient
          colors={[currentTheme.colors.primary, currentTheme.colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>
    </>
  );
};

export default GradientStatusBar;