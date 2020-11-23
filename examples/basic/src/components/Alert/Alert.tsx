import React from 'react'
import './Alert.css'

interface Props {
  children: string
}
export const Alert = ({ children }: Props) => <div className="alert">{children}</div>
