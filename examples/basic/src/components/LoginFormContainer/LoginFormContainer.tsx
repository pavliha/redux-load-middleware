import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoginForm, LoginFormValues } from '../LoginForm'
import { loginUser } from '../../store/auth/actions'
import { selectLoginUserErrors, selectLoginUserLoading } from './selectors'

export const LoginFormContainer = () => {
  const dispatch = useDispatch()
  const isLoginUserLoading = useSelector(selectLoginUserLoading)
  const errors = useSelector(selectLoginUserErrors)

  const handleSubmit = (values: LoginFormValues) => {
    dispatch(loginUser(values.email, values.password, values.connection))
  }

  return <LoginForm pending={isLoginUserLoading} errors={errors} onSubmit={handleSubmit} />
}
