import React from 'react'
import { Alert } from '../Alert'
import { useSelector } from 'react-redux'
import { selectAlertError } from './selectors'

export const AlertContainer = () => {
  const message = useSelector(selectAlertError)

  if (!message) return null

  return <Alert>{message}</Alert>
}
