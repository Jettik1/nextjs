import bcrypt from 'bcryptjs'
import { UserRole } from '@/lib/utils'

const data = {
  users: [
    {
      name: 'Owner',
      email: 'contrakt120@gmail.com',
      password: bcrypt.hashSync('AdminPass'),
      role: UserRole.Owner,
    },
    {
      name: '1Admin',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      role: UserRole.Admin,
    },
    {
      name: '2user',
      email: 'user2@example.com',
      password: bcrypt.hashSync('123456'),
      role: UserRole.User,
    },
  ],
  categories: [
    {
      _id: '645f1b23a1c2e3d4567e89ab', // Пример ID, должен соответствовать MongoDB ObjectId
      name: 'Новогодние игрушки',
    },
    {
      _id: '645f1b23a1c2e3d4567e89ac', // Пример ID
      name: 'Шары',
    },
    {
      _id: '645f1b23a1c2e3d4567e89ad', // Пример ID
      name: 'Медальоны',
    },
  ],
  products: [
    {
      name: 'Шары ручной работы "Хочу в Евпаторию"',
      slug: 'shari-hochu_v_Evpatoriyu',
      categories: ['645f1b23a1c2e3d4567e89ab', '645f1b23a1c2e3d4567e89ac'],
      images: ['/images/hochu_v_Evpatoriyu.jpg'],
      price: 7000,
      countInStock: 10,
      description:
        'Шары ручной работы "Хочу в Евпаторию" в ассортименте. 7-14 см. цена от 900 до 1400руб. Ручная рабита. Акрил. Витражные краски, контуры, гели, бусины, стразы.',
    },
    {
      name: 'Шары, медальоны новогодние "Снегири"',
      slug: 'shari-snegiri',
      categories: ['645f1b23a1c2e3d4567e89ab', '645f1b23a1c2e3d4567e89ac'],
      images: ['/images/snegiri.jpg'],
      price: 1200,
      countInStock: 10,
      description:
        '11-14см. цена 1200-1400. Ручная работа. Витражные краски, контуры, гели, стразы.',
    },
    {
      name: 'Шар новогодний "Лаванда"',
      slug: 'shari-lavanda',
      categories: ['645f1b23a1c2e3d4567e89ab', '645f1b23a1c2e3d4567e89ac'],
      images: ['/images/Lavanda.jpg'],
      price: 1000,
      countInStock: 10,
      description:
        'Шар новогодний "Лаванда". диаметр 14 см. Акрил. Ручная работа. Витражные краски, гели, декоративная стеклянная крошка.',
    },
    {
      name: 'Медальон-игрушка на ёлку "Солнечный янтарь"',
      slug: 'golf-pants',
      categories: ['645f1b23a1c2e3d4567e89ab', '645f1b23a1c2e3d4567e89ad'],
      images: ['/images/Solnecnhy_Yantar.jpg'],
      price: 1000,
      countInStock: 10,
      description:
        'Полная имитация янтаря. Диаметр 8 см. Ручная работа. Акрил, гели, краски, бусины, натуральный янтарь.',
    },
    {
      name: 'Шар новогодний "к деньгам" "Ирисы, лягушка".',
      slug: 'shari-k_dengam',
      categories: ['645f1b23a1c2e3d4567e89ab', '645f1b23a1c2e3d4567e89ac'],
      images: ['/images/k_dengam.jpg'],
      price: 1500,
      countInStock: 10,
      description:
        'Ручная работа. Акрил. 10 см. Витражные краски, гели. Внутри на подвесе стеклянная лягушка ручной работы.',
    },
    {
      name: 'Медальон на ёлку "Без пяти"',
      slug: 'medalion-bez_pyati',
      categories: ['645f1b23a1c2e3d4567e89ab', '645f1b23a1c2e3d4567e89ad'],
      images: ['/images/bez_pyati.jpg'],
      price: 600,
      countInStock: 10,
      description: 'Ручная работа. Акрил 8 см. Витражные краски, гели, бусины',
    },
  ],
}

export default data
