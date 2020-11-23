import { c } from '../constants'
import { LoginUserAction, LoginUserSuccessAction } from './actions'
import { User } from '../../api'

interface AuthState {
  user?: User
}

type Actions = LoginUserAction | LoginUserSuccessAction

const authReducer = (state: AuthState = {}, action: Actions): AuthState => {
  switch (action.type) {
    case c.LOGIN_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}

export default authReducer
