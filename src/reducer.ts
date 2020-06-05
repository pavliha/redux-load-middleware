import { StatusActions } from './action'
import c from './constants'
import { Loader } from './types'

interface StatusState {
  error: Error | null
  loader: Loader | null
}
const INITIAL_STATE: StatusState = {
  loader: null,
  error: null,
}

export const statusReducer = (state = INITIAL_STATE, action: StatusActions): StatusState => {
  switch (action.type) {
    case c.SHOW_LOADER:
      return {
        ...state,
        loader: action.payload,
      }

    case c.HIDE_LOADER:
      return {
        ...state,
        loader: null,
      }

    case c.SHOW_ERROR:
      return {
        ...state,
        error: action.payload,
      }

    case c.CLEAR_STATUS:
      return INITIAL_STATE

    default:
      return state
  }
}
