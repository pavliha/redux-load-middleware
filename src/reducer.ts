import { StatusActions } from './action'
import c from './constants'
import { Loading } from './types'

interface StatusState {
  error: Error | null
  loading: Loading | null
}
const INITIAL_STATE: StatusState = {
  loading: null,
  error: null,
}

export const statusReducer = (state = INITIAL_STATE, action: StatusActions): StatusState => {
  switch (action.type) {
    case c.SHOW_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    case c.HIDE_LOADING:
      return {
        ...state,
        loading: null,
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
