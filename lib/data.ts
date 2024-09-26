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
  products: [
    {
      name: 'Free Shirt',
      slug: 'free-shirt',
      category: 'Shirts',
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
      category: 'Shirts',
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
      category: 'Shirts',
      images: ['/images/shirt3.jpg'],
      price: 9000,
      countInStock: 20,
      description: 'A popular shirt',
    },
    {
      name: 'Golf Pants',
      slug: 'golf-pants',
      category: 'Pants',
      images: ['/images/pants1.jpg'],
      price: 9000,
      countInStock: 20,
      description: 'Smart looking pants',
    },
    {
      name: 'Fit Pants',
      slug: 'fit-pants',
      category: 'Pants',
      images: ['/images/pants2.jpg'],
      price: 9500,
      countInStock: 20,
      description: 'A popular pants',
    },
    {
      name: 'Classic Pants',
      slug: 'classic-pants',
      category: 'Pants',
      images: ['/images/pants3.jpg'],
      price: 7500,
      countInStock: 20,
      description: 'A popular pants',
    },
  ],
}

export default data
