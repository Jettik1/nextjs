import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Авторизация',
}

export default async function SignIn() {
  return <Form />
}
