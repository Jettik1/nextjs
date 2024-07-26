'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  const router = useRouter()
  let callbackUrl = params.get('callbackUrl') || '/'

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        return router.push(
          `/signin?callbackUrl=${callbackUrl}&success=Account has been created`
        )
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const error =
          err.message && err.message.indexOf('E11000') === 0
            ? 'Email уже зарегистрирован'
            : err.message
        toast.error(error || 'error')
      } else {
        toast.error('Unknown error')
      }
    }
  }

  return (
    <div className="max-w-sm  mx-auto card bg-base-dark-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Register</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="name">
              Имя
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Нужно Имя',
              })}
              className="input input-bordered w-full max-w-sm bg-base-dark-blue-300"
            />
            {errors.name?.message && (
              <div className="text-error">{errors.name.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email', {
                required: 'Email обязателен',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email is invalid',
                },
              })}
              className="input input-bordered w-full max-w-sm bg-base-dark-blue-300"
            />
            {errors.email?.message && (
              <div className="text-error"> {errors.email.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Нужен пароль',
              })}
              className="input input-bordered w-full max-w-sm bg-base-dark-blue-300"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="confirmPassword">
              Подтвердите пароль
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) => {
                  const { password } = getValues()
                  return password === value || 'Пароли должны совпадать!'
                },
              })}
              className="input input-bordered w-full max-w-sm bg-base-dark-blue-300"
            />
            {errors.confirmPassword?.message && (
              <div className="text-error">{errors.confirmPassword.message}</div>
            )}
          </div>
          <div className="my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Зарегистрироваться
            </button>
          </div>
        </form>

        <div>
          Уже есть аккаунт?{' '}
          <Link className="link" href={`/signin?callbackUrl=${callbackUrl}`}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
