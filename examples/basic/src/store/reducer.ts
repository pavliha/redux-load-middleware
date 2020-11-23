import { combineReducers } from 'redux'
import { errorsReducer, loadingsReducer } from 'redux-load-middleware' // from redux-load-middleware
import authReducer from './auth/reducer'

const reducer = combineReducers({
  loadings: loadingsReducer,
  errors: errorsReducer,
  auth: authReducer,
})

export type State = ReturnType<typeof reducer>

export default reducer
