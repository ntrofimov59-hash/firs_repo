import React from 'react';
import AnimatedIcon from './JS AnimatedIcon';

export const EmployeeIcon = ({ size = 28, color, animated = true }) => (
  <AnimatedIcon 
    type="ionicons"
    name="people" 
    size={size} 
    color={color}
    animated={animated}
  />
);

export const AnalyticsIcon = ({ size = 28, color, animated = true }) => (
  <AnimatedIcon 
    type="ionicons"
    name="bar-chart" 
    size={size} 
    color={color}
    animated={animated}
  />
);

export const ReportsIcon = ({ size = 28, color, animated = true }) => (
  <AnimatedIcon 
    type="ionicons"
    name="document-text" 
    size={size} 
    color={color}
    animated={animated}
  />
);

export const SupplyIcon = ({ size = 28, color, animated = true }) => (
  <AnimatedIcon 
    type="feather"
    name="package" 
    size={size} 
    color={color}
    animated={animated}
  />
);

export const DashboardIcon = ({ size = 28, color, animated = true }) => (
  <AnimatedIcon 
    type="ionicons"
    name="home" 
    size={size} 
    color={color}
    animated={animated}
  />
);

export const AddIcon = ({ size = 28, color, animated = true }) => (
  <AnimatedIcon 
    type="ionicons"
    name="add" 
    size={size} 
    color={color}
    animated={animated}
  />
);