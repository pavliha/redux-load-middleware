export type User = {
  id: number
  name: string
  email: string
  password: string
}

export type ValidationError = {
  field: string
  message: string
}
