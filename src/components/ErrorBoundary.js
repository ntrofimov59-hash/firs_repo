import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import errorHandler from '../utils/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Логируем ошибку
    errorHandler.logError(error, {
      componentStack: errorInfo.componentStack,
      boundary: this.props.name || 'Unknown'
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onRetry?.();
  };

  handleReport = () => {
    // В будущем можно добавить отправку отчета об ошибке
    console.log('Error report:', {
      error: this.state.error,
      errorInfo: this.state.errorInfo
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😵</Text>
            <Text style={styles.title}>Что-то пошло не так</Text>
            <Text style={styles.message}>
              {this.props.fallbackMessage || 'Произошла непредвиденная ошибка в приложении.'}
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>Информация для разработки:</Text>
                <Text style={styles.debugText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={this.handleRetry}
              >
                <Text style={styles.buttonText}>Попробовать снова</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleReport}
              >
                <Text style={styles.buttonText}>Сообщить об ошибке</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  content: {
    alignItems: 'center',
    maxWidth: 400
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#2c3e50'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#7f8c8d',
    lineHeight: 22
  },
  debugInfo: {
    backgroundColor: '#ffeaa7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%'
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#e17055'
  },
  debugText: {
    fontSize: 12,
    color: '#2d3436'
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 140
  },
  primaryButton: {
    backgroundColor: '#3498db'
  },
  secondaryButton: {
    backgroundColor: '#95a5a6'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default ErrorBoundary;