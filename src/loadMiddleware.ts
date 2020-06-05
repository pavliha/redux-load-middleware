import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AppError, LoadAction, PayloadAction, StatusState } from './types'
import { clearStatus, hideLoading, showError, showLoading } from './action'
import c from './constants'
import { isStatusClear } from './selectors'

type GenericLoadAction = LoadAction<keyof c, unknown>

const showSuccess = (loadAction: GenericLoadAction, response: unknown): PayloadAction<string, unknown> => ({
  type: loadAction.type + '_SUCCESS',
  payload: response,
  meta: loadAction.meta,
})

const handlePrepare = async (dispatch: Dispatch, state: StatusState) => {
  if (!isStatusClear(state)) dispatch(clearStatus())
}

const handleSuccess = async (loadAction: GenericLoadAction, dispatch: Dispatch) => {
  if (loadAction.options?.loader) {
    dispatch(showLoading(loadAction.options.loader))
  }
  const response = await loadAction.load
  dispatch(showSuccess(loadAction, response))
}

const handleError = (error: Error, loadAction: GenericLoadAction, dispatch: Dispatch) => {
  const myApplicationError = AppError
  const fallbackError = loadAction?.options?.error
  const isApplicationError = error instanceof myApplicationError
  if (isApplicationError) dispatch(showError(error))
  if (!isApplicationError && fallbackError) dispatch(showError(fallbackError))
  throw error
}

const load = async (loadAction: GenericLoadAction, dispatch: Dispatch, state: StatusState) => {
  await handlePrepare(dispatch, state)
  try {
    await handleSuccess(loadAction, dispatch)
  } catch (error) {
    handleError(error, loadAction, dispatch)
  } finally {
    if (loadAction.options?.loader) {
      dispatch(hideLoading(loadAction.options.loader))
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
