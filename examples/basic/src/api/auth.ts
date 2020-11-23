import { wait } from './utils'
import { User } from './types'
import { ApiError } from './errors'

export const auth = {
  async login(email: string, password: string, connection: boolean): Promise<User> {
    await wait(500)
    if (!connection) throw new Error('any error message')
    if (email === 'test@test.com') {
      throw new ApiError([{ field: 'email', message: 'This email already taken!' }])
    }
    return {
      id: 1,
      name: 'John Doe',
      email,
      password,
    }
  },
}
