import { LoadAction, PayloadAction } from 'redux-load-middleware'
import { c, loadings } from '../constants'
import api, { User } from '../../api'
import { loginUserErrors } from './errors'

export type LoginUserAction = LoadAction<c.LOGIN_USER, User>
export type LoginUserSuccessAction = PayloadAction<c.LOGIN_USER_SUCCESS, User>

export const loginUser = (email: string, password: string, connection: boolean): LoginUserAction => ({
  type: c.LOGIN_USER,
  load: api.auth.login(email, password, connection),
  loading: loadings.loginUser,
  errors: loginUserErrors,
})
