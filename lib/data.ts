import bcrypt from 'bcryptjs'
import { UserRole } from './models/UserModel'

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
      name: 'Shirts',
    },
    {
      _id: '645f1b23a1c2e3d4567e89ac', // Пример ID
      name: 'Pants',
    },
  ],
  products: [
    {
      name: 'Free Shirt',
      slug: 'free-shirt',
      categories: ['645f1b23a1c2e3d4567e89ab'], // ID категории Shirts
      images: ['/images/shirt1.jpg'],
      price: 7000,
      countInStock: 20,
      description: 'A popular shirt',
      isFeatured: true,
      banner: '/images/banner1.jpg',
    },
    {
      name: 'Fit Shirt',
      slug: 'fit-shirt',
      categories: ['645f1b23a1c2e3d4567e89ab'], // ID категории Shirts
      images: ['/images/shirt2.jpg'],
      price: 8000,
      countInStock: 20,
      description: 'A popular shirt',
      isFeatured: true,
      banner: '/images/banner2.jpg',
    },
    {
      name: 'Slim Shirt',
      slug: 'slim-shirt',
      categories: ['645f1b23a1c2e3d4567e89ab'], // ID категории Shirts
      images: ['/images/shirt3.jpg'],
      price: 9000,
      countInStock: 20,
      description: 'A popular shirt',
    },
    {
      name: 'Golf Pants',
      slug: 'golf-pants',
      categories: ['645f1b23a1c2e3d4567e89ac'], // ID категории Pants
      images: ['/images/pants1.jpg'],
      price: 9000,
      countInStock: 20,
      description: 'Smart looking pants',
    },
    {
      name: 'Fit Pants',
      slug: 'fit-pants',
      categories: ['645f1b23a1c2e3d4567e89ac'], // ID категории Pants
      images: ['/images/pants2.jpg'],
      price: 9500,
      countInStock: 20,
      description: 'A popular pants',
    },
    {
      name: 'Classic Pants',
      slug: 'classic-pants',
      categories: ['645f1b23a1c2e3d4567e89ac'], // ID категории Pants
      images: ['/images/pants3.jpg'],
      price: 7500,
      countInStock: 20,
      description: 'A popular pants',
    },
  ],
}

export default data
