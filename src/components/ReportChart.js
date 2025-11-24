import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { glassStyle, blueGlassStyle, orangeGlassStyle } from '../styles/themes';

const { width } = Dimensions.get('window');

const ReportChart = ({ type, data, height = 220, title = "" }) => {
  const { currentTheme } = useTheme();

  // Функция для очистки данных от NaN и undefined
  const cleanData = (rawData) => {
    if (!rawData) return [];
    
    return rawData.map(value => {
      if (value === undefined || value === null || isNaN(value)) {
        return 0;
      }
      return Number(value);
    });
  };

  // Функция для очистки данных pie chart
  const cleanPieData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return [
        { name: 'Нет данных', value: 1, color: '#999', legendFontColor: currentTheme.colors.text, legendFontSize: 12 }
      ];
    }

    return rawData.map((item, index) => ({
      name: item.name || `Элемент ${index + 1}`,
      value: item.value || item.population || 1,
      color: item.color || `hsl(${index * 60}, 70%, 50%)`,
      legendFontColor: currentTheme.colors.text,
      legendFontSize: 12
    }));
  };

  // Базовая конфигурация графиков
  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: currentTheme.colors.backgroundSecondary,
    backgroundGradientTo: currentTheme.colors.backgroundSecondary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${
      currentTheme.name === 'dark' ? '236, 240, 241' : '44, 62, 80'
    }, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: currentTheme.colors.secondary,
    }
  };

  const renderChart = () => {
    try {
      switch (type) {
        case 'line':
          const lineData = {
            ...data,
            datasets: data.datasets?.map(dataset => ({
              ...dataset,
              data: cleanData(dataset.data)
            })) || [{ data: [0, 0, 0, 0, 0, 0] }]
          };
          
          return (
            <LineChart
              data={lineData}
              width={width - 48}
              height={height}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withVerticalLines={false}
              withHorizontalLines={false}
              withShadow={false}
              withInnerLines={false}
            />
          );

        case 'bar':
          const barData = {
            ...data,
            datasets: data.datasets?.map(dataset => ({
              ...dataset,
              data: cleanData(dataset.data)
            })) || [{ data: [0, 0, 0, 0] }]
          };

          return (
            <BarChart
              data={barData}
              width={width - 48}
              height={height}
              chartConfig={chartConfig}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              showValuesOnTopOfBars={true}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              fromZero={true}
            />
          );

        case 'pie':
          const pieData = cleanPieData(data);
          
          return (
            <PieChart
              data={pieData}
              width={width - 48}
              height={height}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={true}
            />
          );

        default:
          return (
            <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: currentTheme.colors.text }}>
                Неподдерживаемый тип графика
              </Text>
            </View>
          );
      }
    } catch (error) {
      console.warn('Ошибка при рендеринге графика:', error);
      return (
        <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: currentTheme.colors.text }}>
            Ошибка загрузки графика
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={[
      glassStyle(currentTheme),
      { 
        marginVertical: 16,
        padding: 16,
        borderRadius: 16,
      }
    ]}>
      {title ? (
        <Text style={[
          currentTheme.typography.title,
          { 
            textAlign: 'center',
            marginBottom: 16,
            color: currentTheme.colors.text
          }
        ]}>
          {title}
        </Text>
      ) : null}
      {renderChart()}
    </View>
  );
};

export default ReportChart;