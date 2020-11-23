import React, { FormEvent } from 'react'
import { Dictionary } from 'lodash'
import './LoginForm.css'

export type LoginFormValues = {
  email: string
  password: string
  connection: boolean
}

interface Props {
  errors?: Dictionary<string>
  pending?: boolean
  onSubmit: (values: LoginFormValues) => void
}
export const LoginForm = ({ pending, errors, onSubmit }: Props) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const values = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      connection: !formData.get('connection'),
    }
    onSubmit(values)
  }

  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      <input className="input" name="email" placeholder="Enter your email" defaultValue={'test@test.com'} />
      <div className="error">{errors?.email}</div>
      <input className="input" name="password" placeholder="Enter your password" defaultValue={'qwerty123'} />
      <div className="error">{errors?.password}</div>
      <button disabled={pending} className="submitButton" type="submit">
        {pending ? 'loading...' : 'login'}
      </button>
      <label>
        <input name="connection" type="checkbox" />
        Simulate connection error
      </label>
    </form>
  )
}
