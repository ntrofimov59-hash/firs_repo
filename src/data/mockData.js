// src/data/mockData.js
export const mockRestaurants = [
  {
    id: 1,
    name: 'Ресторан "Белладжио"',
    category: 'Вверх',
    currentRevenue: 125430,
    monthlyRevenue: 2508600,
    isOpen: true,
    employees: [
      { id: 1, name: 'Иван Петров', position: 'Шеф-повар', isActive: true },
      { id: 2, name: 'Мария Сидорова', position: 'Официант', isActive: true },
      { id: 3, name: 'Анна Ковалева', position: 'Бармен', isActive: false }
    ],
    todaySales: 45,
    pendingSupplies: 2,
    phone: '+7 (495) 123-45-67',
    address: 'ул. Тверская, 25',
    schedule: '10:00 - 23:00',
    todayStats: {
      orders: 45,
      averageOrder: 2787,
      popularItems: [
        { name: 'Ролл Филадельфия', count: 12 },
        { name: 'Удон с курицей', count: 8 },
        { name: 'Том Ям', count: 6 }
      ]
    },
    supplies: [
      { id: 1, product: 'Лосось', quantity: 5, unit: 'кг', status: 'доставлено' },
      { id: 2, product: 'Рис для суши', quantity: 20, unit: 'кг', status: 'в пути' },
      { id: 3, product: 'Овощи', quantity: 15, unit: 'кг', status: 'ожидает' }
    ],
    rating: 4.8,
    totalEmployees: 3,
    email: 'bellagio@restaurant.ru',
    description: 'Премиальный ресторан с европейской кухней',
    features: ['Wi-Fi', 'Терраса', 'Банкеты', 'Доставка'],
    menu: [
      { id: 1, name: 'Ролл Филадельфия', price: 680, category: 'Роллы' },
      { id: 2, name: 'Удон с курицей', price: 450, category: 'Основные блюда' },
      { id: 3, name: 'Том Ям', price: 520, category: 'Супы' }
    ]
  },
  {
    id: 2,
    name: 'Паста Бар',
    category: 'Низ',
    currentRevenue: 98760,
    monthlyRevenue: 1975200,
    isOpen: true,
    employees: [
      { id: 1, name: 'Алексей Козлов', position: 'Шеф-повар', isActive: true },
      { id: 2, name: 'Елена Васнецова', position: 'Официант', isActive: true }
    ],
    todaySales: 32,
    pendingSupplies: 1,
    phone: '+7 (495) 234-56-78',
    address: 'ул. Арбат, 15',
    schedule: '11:00 - 22:00',
    todayStats: {
      orders: 32,
      averageOrder: 3086,
      popularItems: [
        { name: 'Карбонара', count: 10 },
        { name: 'Маргарита', count: 8 },
        { name: 'Тирамису', count: 5 }
      ]
    },
    supplies: [
      { id: 1, product: 'Спагетти', quantity: 30, unit: 'кг', status: 'доставлено' },
      { id: 2, product: 'Пармезан', quantity: 5, unit: 'кг', status: 'ожидает' }
    ],
    rating: 4.5,
    totalEmployees: 2,
    email: 'pastabar@restaurant.ru',
    description: 'Аутентичная итальянская кухня',
    features: ['Паста-бар', 'Винотека', 'Доставка'],
    menu: [
      { id: 1, name: 'Карбонара', price: 520, category: 'Паста' },
      { id: 2, name: 'Маргарита', price: 480, category: 'Пицца' },
      { id: 3, name: 'Тирамису', price: 320, category: 'Десерты' }
    ]
  },
  {
    id: 3,
    name: 'Бургер Хаус',
    category: 'Вверх',
    currentRevenue: 156780,
    monthlyRevenue: 3135600,
    isOpen: true,
    employees: [
      { id: 1, name: 'Дмитрий Соколов', position: 'Повар', isActive: true },
      { id: 2, name: 'Ольга Иванова', position: 'Кассир', isActive: true },
      { id: 3, name: 'Петр Сидоров', position: 'Повар', isActive: true }
    ],
    todaySales: 67,
    pendingSupplies: 3,
    phone: '+7 (495) 345-67-89',
    address: 'пр. Мира, 42',
    schedule: '09:00 - 24:00',
    todayStats: {
      orders: 67,
      averageOrder: 2340,
      popularItems: [
        { name: 'Чизбургер', count: 25 },
        { name: 'Картофель фри', count: 18 },
        { name: 'Кола', count: 15 }
      ]
    },
    supplies: [
      { id: 1, product: 'Говядина', quantity: 25, unit: 'кг', status: 'доставлено' },
      { id: 2, product: 'Булочки', quantity: 200, unit: 'шт', status: 'в пути' },
      { id: 3, product: 'Сыр', quantity: 10, unit: 'кг', status: 'ожидает' }
    ],
    rating: 4.3,
    totalEmployees: 3,
    email: 'burgerhouse@restaurant.ru',
    description: 'Лучшие бургеры в городе',
    features: ['Фаст-фуд', 'Доставка', 'Еда навынос'],
    menu: [
      { id: 1, name: 'Чизбургер', price: 380, category: 'Бургеры' },
      { id: 2, name: 'Картофель фри', price: 180, category: 'Закуски' },
      { id: 3, name: 'Кола', price: 120, category: 'Напитки' }
    ]
  },
  {
    id: 4,
    name: 'Суши Мастер',
    category: 'Низ',
    currentRevenue: 113450,
    monthlyRevenue: 2269000,
    isOpen: false,
    employees: [
      { id: 1, name: 'Сергей Никитин', position: 'Сушист', isActive: false }
    ],
    todaySales: 28,
    pendingSupplies: 0,
    phone: '+7 (495) 456-78-90',
    address: 'ул. Пушкинская, 8',
    schedule: '11:00 - 22:00',
    todayStats: {
      orders: 28,
      averageOrder: 4051,
      popularItems: [
        { name: 'Ролл Калифорния', count: 8 },
        { name: 'Сашими', count: 5 },
        { name: 'Мисо суп', count: 4 }
      ]
    },
    supplies: [
      { id: 1, product: 'Рис', quantity: 50, unit: 'кг', status: 'доставлено' }
    ],
    rating: 4.7,
    totalEmployees: 1,
    email: 'sushimaster@restaurant.ru',
    description: 'Свежие суши и роллы',
    features: ['Суши-бар', 'Доставка', 'Еда навынос'],
    menu: [
      { id: 1, name: 'Ролл Калифорния', price: 580, category: 'Роллы' },
      { id: 2, name: 'Сашими', price: 750, category: 'Сашими' },
      { id: 3, name: 'Мисо суп', price: 220, category: 'Супы' }
    ]
  }
];

export const mockEmployees = [
  {
    id: 1,
    name: 'Иван Петров',
    position: 'Шеф-повар',
    email: 'i.petrov@bellagio.ru',
    phone: '+7 (916) 123-45-67',
    restaurantId: 1,
    salary: 120000,
    hireDate: '2023-01-15',
    status: 'active',
    isActive: true,
    image: '👨‍🍳',
    skills: ['Европейская кухня', 'Управление кухней', 'Закупки']
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    position: 'Официант',
    email: 'm.sidorova@bellagio.ru',
    phone: '+7 (916) 234-56-78',
    restaurantId: 1,
    salary: 45000,
    hireDate: '2023-03-20',
    status: 'active',
    isActive: true,
    image: '👩‍💼',
    skills: ['Обслуживание', 'Знание меню', 'Работа с гостями']
  },
  {
    id: 3,
    name: 'Анна Ковалева',
    position: 'Бармен',
    email: 'a.kovaleva@bellagio.ru',
    phone: '+7 (916) 345-67-89',
    restaurantId: 1,
    salary: 50000,
    hireDate: '2023-05-10',
    status: 'inactive',
    isActive: false,
    image: '👩‍🍳',
    skills: ['Коктейли', 'Вина', 'Барменское искусство']
  },
  {
    id: 4,
    name: 'Алексей Козлов',
    position: 'Шеф-повар',
    email: 'a.kozlov@pastabar.ru',
    phone: '+7 (916) 456-78-90',
    restaurantId: 2,
    salary: 110000,
    hireDate: '2023-02-14',
    status: 'active',
    isActive: true,
    image: '👨‍🍳',
    skills: ['Итальянская кухня', 'Паста', 'Соусы']
  },
  {
    id: 5,
    name: 'Елена Васнецова',
    position: 'Официант',
    email: 'e.vasnecova@pastabar.ru',
    phone: '+7 (916) 567-89-01',
    restaurantId: 2,
    salary: 42000,
    hireDate: '2023-04-18',
    status: 'active',
    isActive: true,
    image: '👩‍💼',
    skills: ['Обслуживание', 'Итальянская кухня']
  },
  {
    id: 6,
    name: 'Дмитрий Соколов',
    position: 'Повар',
    email: 'd.sokolov@burgerhouse.ru',
    phone: '+7 (916) 678-90-12',
    restaurantId: 3,
    salary: 65000,
    hireDate: '2023-03-05',
    status: 'active',
    isActive: true,
    image: '👨‍🍳',
    skills: ['Бургеры', 'Фаст-фуд', 'Гриль']
  },
  {
    id: 7,
    name: 'Ольга Иванова',
    position: 'Кассир',
    email: 'o.ivanova@burgerhouse.ru',
    phone: '+7 (916) 789-01-23',
    restaurantId: 3,
    salary: 38000,
    hireDate: '2023-06-12',
    status: 'active',
    isActive: true,
    image: '👩‍💼',
    skills: ['Касса', 'Обслуживание', 'Работа с наличными']
  },
  {
    id: 8,
    name: 'Петр Сидоров',
    position: 'Повар',
    email: 'p.sidorov@burgerhouse.ru',
    phone: '+7 (916) 890-12-34',
    restaurantId: 3,
    salary: 60000,
    hireDate: '2023-05-20',
    status: 'active',
    isActive: true,
    image: '👨‍🍳',
    skills: ['Бургеры', 'Закуски', 'Фритюр']
  },
  {
    id: 9,
    name: 'Сергей Никитин',
    position: 'Сушист',
    email: 's.nikitin@sushimaster.ru',
    phone: '+7 (916) 901-23-45',
    restaurantId: 4,
    salary: 80000,
    hireDate: '2023-01-10',
    status: 'inactive',
    isActive: false,
    image: '👨‍🍳',
    skills: ['Суши', 'Роллы', 'Японская кухня']
  }
];

export const mockSupplies = [
  {
    id: 1,
    name: 'Лосось',
    category: 'Рыба',
    supplier: 'ООО "Рыбный мир"',
    quantity: 5,
    unit: 'кг',
    restaurantId: 1,
    lastDelivery: '2024-01-15',
    nextDelivery: '2024-01-22',
    status: 'delivered'
  },
  {
    id: 2,
    name: 'Рис для суши',
    category: 'Крупы',
    supplier: 'ООО "Восточные продукты"',
    quantity: 20,
    unit: 'кг',
    restaurantId: 1,
    lastDelivery: '2024-01-14',
    nextDelivery: '2024-01-21',
    status: 'in_transit'
  },
  {
    id: 3,
    name: 'Овощи',
    category: 'Овощи',
    supplier: 'ООО "Фермерские продукты"',
    quantity: 15,
    unit: 'кг',
    restaurantId: 1,
    lastDelivery: '2024-01-13',
    nextDelivery: '2024-01-20',
    status: 'pending'
  },
  {
    id: 4,
    name: 'Спагетти',
    category: 'Макароны',
    supplier: 'ООО "Итальянские продукты"',
    quantity: 30,
    unit: 'кг',
    restaurantId: 2,
    lastDelivery: '2024-01-15',
    nextDelivery: '2024-01-25',
    status: 'delivered'
  },
  {
    id: 5,
    name: 'Пармезан',
    category: 'Сыры',
    supplier: 'ООО "Сыроварня"',
    quantity: 5,
    unit: 'кг',
    restaurantId: 2,
    lastDelivery: '2024-01-10',
    nextDelivery: '2024-01-24',
    status: 'pending'
  },
  {
    id: 6,
    name: 'Говядина',
    category: 'Мясо',
    supplier: 'ООО "Мясной двор"',
    quantity: 25,
    unit: 'кг',
    restaurantId: 3,
    lastDelivery: '2024-01-14',
    nextDelivery: '2024-01-21',
    status: 'delivered'
  },
  {
    id: 7,
    name: 'Булочки',
    category: 'Хлеб',
    supplier: 'ООО "Пекарня"',
    quantity: 200,
    unit: 'шт',
    restaurantId: 3,
    lastDelivery: '2024-01-13',
    nextDelivery: '2024-01-20',
    status: 'in_transit'
  },
  {
    id: 8,
    name: 'Сыр',
    category: 'Сыры',
    supplier: 'ООО "Сыроварня"',
    quantity: 10,
    unit: 'кг',
    restaurantId: 3,
    lastDelivery: '2024-01-12',
    nextDelivery: '2024-01-19',
    status: 'pending'
  },
  {
    id: 9,
    name: 'Рис',
    category: 'Крупы',
    supplier: 'ООО "Восточные продукты"',
    quantity: 50,
    unit: 'кг',
    restaurantId: 4,
    lastDelivery: '2024-01-15',
    nextDelivery: '2024-01-29',
    status: 'delivered'
  }
];

export const mockReports = {
  monthlyRevenue: [
    { month: 'Янв', revenue: 4500000 },
    { month: 'Фев', revenue: 5200000 },
    { month: 'Мар', revenue: 4800000 },
    { month: 'Апр', revenue: 6100000 },
    { month: 'Май', revenue: 5900000 },
    { month: 'Июн', revenue: 6500000 }
  ],
  popularDishes: [
    { name: 'Чизбургер', orders: 1250 },
    { name: 'Ролл Филадельфия', orders: 980 },
    { name: 'Карбонара', orders: 760 },
    { name: 'Том Ям', orders: 680 },
    { name: 'Маргарита', orders: 550 }
  ],
  restaurantPerformance: [
    { name: 'Белладжио', revenue: 2508600, orders: 1250 },
    { name: 'Бургер Хаус', revenue: 3135600, orders: 2100 },
    { name: 'Паста Бар', revenue: 1975200, orders: 980 },
    { name: 'Суши Мастер', revenue: 2269000, orders: 850 }
  ]
};