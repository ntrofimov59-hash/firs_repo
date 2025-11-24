// Утилиты для валидации данных
import React from 'react';

export const Validators = {
  // Валидация email
  email: (value) => {
    if (!value) return 'Email обязателен для заполнения';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Введите корректный email адрес';
    }
    
    return null;
  },

  // Валидация телефона (русский формат)
  phone: (value) => {
    if (!value) return 'Телефон обязателен для заполнения';
    
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    const cleaned = value.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(value) || cleaned.length < 10) {
      return 'Введите корректный номер телефона';
    }
    
    return null;
  },

  // Валидация обязательного поля
  required: (value, fieldName = 'Поле') => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} обязательно для заполнения`;
    }
    return null;
  },

  // Валидация минимальной длины
  minLength: (value, min, fieldName = 'Поле') => {
    if (value && value.length < min) {
      return `${fieldName} должно содержать минимум ${min} символов`;
    }
    return null;
  },

  // Валидация максимальной длины
  maxLength: (value, max, fieldName = 'Поле') => {
    if (value && value.length > max) {
      return `${fieldName} должно содержать не более ${max} символов`;
    }
    return null;
  },

  // Валидация чисел
  number: (value, fieldName = 'Поле') => {
    if (value && isNaN(Number(value))) {
      return `${fieldName} должно быть числом`;
    }
    return null;
  },

  // Валидация положительного числа
  positiveNumber: (value, fieldName = 'Поле') => {
    const numError = Validators.number(value, fieldName);
    if (numError) return numError;
    
    if (value && Number(value) <= 0) {
      return `${fieldName} должно быть положительным числом`;
    }
    return null;
  },

  // Валидация URL
  url: (value) => {
    if (!value) return null;
    
    try {
      new URL(value);
      return null;
    } catch {
      return 'Введите корректный URL адрес';
    }
  },

  // Валидация даты
  date: (value) => {
    if (!value) return null;
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Введите корректную дату';
    }
    
    return null;
  },

  // Валидация будущей даты
  futureDate: (value) => {
    const dateError = Validators.date(value);
    if (dateError) return dateError;
    
    if (value && new Date(value) <= new Date()) {
      return 'Дата должна быть в будущем';
    }
    
    return null;
  },

  // Валидация пароля
  password: (value) => {
    if (!value) return 'Пароль обязателен для заполнения';
    
    if (value.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      return 'Пароль должен содержать буквы в верхнем и нижнем регистре';
    }
    
    if (!/(?=.*\d)/.test(value)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    
    return null;
  },

  // Составная валидация (несколько правил)
  validate: (value, rules, fieldName = 'Поле') => {
    for (const rule of rules) {
      const error = rule(value, fieldName);
      if (error) return error;
    }
    return null;
  }
};

// Специфичные валидаторы для приложения ресторанов
export const RestaurantValidators = {
  // Валидация названия ресторана
  name: (value) => {
    const requiredError = Validators.required(value, 'Название ресторана');
    if (requiredError) return requiredError;
    
    const minLengthError = Validators.minLength(value, 2, 'Название ресторана');
    if (minLengthError) return minLengthError;
    
    const maxLengthError = Validators.maxLength(value, 50, 'Название ресторана');
    if (maxLengthError) return maxLengthError;
    
    return null;
  },

  // Валидация адреса
  address: (value) => {
    const requiredError = Validators.required(value, 'Адрес');
    if (requiredError) return requiredError;
    
    const minLengthError = Validators.minLength(value, 5, 'Адрес');
    if (minLengthError) return minLengthError;
    
    return null;
  },

  // Валидация вместимости ресторана
  capacity: (value) => {
    const numberError = Validators.number(value, 'Вместимость');
    if (numberError) return numberError;
    
    const positiveError = Validators.positiveNumber(value, 'Вместимость');
    if (positiveError) return positiveError;
    
    if (value && Number(value) > 1000) {
      return 'Вместимость не может превышать 1000 человек';
    }
    
    return null;
  },

  // Валидация категории ресторана
  category: (value) => {
    const validCategories = ['Вверх', 'Низ'];
    if (!validCategories.includes(value)) {
      return `Категория должна быть одним из: ${validCategories.join(', ')}`;
    }
    return null;
  }
};

// Валидаторы для сотрудников
export const EmployeeValidators = {
  name: (value) => {
    const requiredError = Validators.required(value, 'Имя сотрудника');
    if (requiredError) return requiredError;
    
    const minLengthError = Validators.minLength(value, 2, 'Имя сотрудника');
    if (minLengthError) return minLengthError;
    
    return null;
  },

  position: (value) => {
    const requiredError = Validators.required(value, 'Должность');
    if (requiredError) return requiredError;
    
    return null;
  },

  salary: (value) => {
    const numberError = Validators.number(value, 'Зарплата');
    if (numberError) return numberError;
    
    const positiveError = Validators.positiveNumber(value, 'Зарплата');
    if (positiveError) return positiveError;
    
    return null;
  }
};

// Хук для удобной валидации в формах
export const useValidation = () => {
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validateField = (fieldName, value, validator) => {
    const error = validator ? validator(value) : null;
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    return error;
  };

  const validateForm = (fields) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(fields).forEach(fieldName => {
      const { value, validator } = fields[fieldName];
      const error = validator ? validator(value) : null;
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const markFieldAsTouched = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const resetValidation = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    validateField,
    validateForm,
    markFieldAsTouched,
    resetValidation,
    hasErrors: Object.keys(errors).length > 0
  };
};