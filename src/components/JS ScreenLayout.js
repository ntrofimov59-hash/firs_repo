import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  StatusBar
} from 'react-native';

const ScreenLayout = ({ 
  children, 
  scrollable = true,
  style,
  contentContainerStyle,
  safeArea = true,
  statusBarStyle = 'dark-content'
}) => {
  
  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView 
          style={[styles.scrollView, style]}
          contentContainerStyle={[
            styles.contentContainer,
            contentContainerStyle
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      );
    }
    
    return (
      <View style={[styles.content, style, contentContainerStyle]}>
        {children}
      </View>
    );
  };

  if (safeArea) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle={statusBarStyle}
          backgroundColor="transparent"
          translucent={true}
        />
        {renderContent()}
      </SafeAreaView>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
});

export default ScreenLayout;