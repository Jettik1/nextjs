'use client'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  email: string
  password: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  let callbackUrl = params.get('callbackUrl') || '/'

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form
    signIn('credentials', { email, password })
  }

  return (
    <div className="max-w-sm mx-auto card bg-base my-4">
      <div className="card-body">
        <h1 className="card-title">Войти</h1>
        {params.get('error') && (
          <div className="alert text-error border-none bg-base-dark-400">
            {params.get('error') === 'CredentialsSignin'
              ? 'Неправильная почта или пароль'
              : params.get('error')}
          </div>
        )}
        {params.get('success') && (
          <div className="alert text-success">{params.get('success')}</div>
        )}
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email', {
                required: 'Введите email',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email неправильный',
                },
              })}
              className="input input-bordered w-full max-w-sm bg-base-dark-blue-300"
            />
            {errors.email?.message && (
              <div className="text-error">{errors.email.message}</div>
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
                required: 'Введите пароль',
              })}
              className="input input-bordered w-full max-w-sm bg-base-dark-blue-300"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Войти
            </button>
          </div>
        </form>
        <div className="mx-auto">
          <Link className="link" href={`register?callbackUrl=${callbackUrl}`}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
