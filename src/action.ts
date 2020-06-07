import { Action } from 'redux'
import c from './constants'
import { Loading, PayloadAction } from './types'

export type ShowLoadingAction = PayloadAction<c.SHOW_LOADING, Loading>
export type HideLoadingAction = PayloadAction<c.HIDE_LOADING, Loading>
export type ShowErrorAction = PayloadAction<c.SHOW_ERROR, Error>
export type ClearStatusAction = Action<c.CLEAR_STATUS>

export type StatusActions = ShowLoadingAction | HideLoadingAction | ShowErrorAction | ClearStatusAction

export const showLoading = (loading: Loading): ShowLoadingAction => ({
  type: c.SHOW_LOADING,
  payload: loading,
})

export const hideLoading = (loader: Loading): HideLoadingAction => ({
  type: c.HIDE_LOADING,
  payload: loader,
})

export const showError = (error: Error): ShowErrorAction => ({
  type: c.SHOW_ERROR,
  payload: error,
})

export const clearStatus = (): ClearStatusAction => ({
  type: c.CLEAR_STATUS,
})
