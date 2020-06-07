import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { GeneralError, LoadAction, PayloadAction, StatusState } from './types'
import { clearStatus, hideLoading, showError, showLoading } from './action'
import c from './constants'
import { isStatusClear } from './selectors'

type GenericLoadAction = LoadAction<keyof c, unknown>

const showSuccess = (loadAction: GenericLoadAction, response: unknown): PayloadAction<string, unknown> => ({
  type: loadAction.type + '_SUCCESS',
  payload: response,
  meta: loadAction.meta,
})

const load = async (loadAction: GenericLoadAction, dispatch: Dispatch, state: StatusState) => {
  if (!isStatusClear(state)) dispatch(clearStatus())
  try {
    if (loadAction.options?.loading) dispatch(showLoading(loadAction.options.loading))
    const response = await loadAction.load
    dispatch(showSuccess(loadAction, response))
    return response
  } catch (error) {
    const fallbackError = loadAction?.options?.fallbackError
    const isGeneralError = error instanceof GeneralError
    if (isGeneralError) return dispatch(showError(error))
    if (!isGeneralError && fallbackError) return dispatch(showError(fallbackError))
    throw error
  } finally {
    if (loadAction.options?.loading) {
      dispatch(hideLoading(loadAction.options.loading))
    }
  }
}

const loadMiddleware: Middleware = ({ dispatch, getState }: MiddlewareAPI) => (next: Dispatch) => {
  return async (action) => {
    next(action)
    if (action.load) return load(action, dispatch, getState())
  }
}

export { loadMiddleware }
