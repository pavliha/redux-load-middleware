import { Action } from 'redux'
import c from './constants'
import { Loader, PayloadAction } from './types'

export type ShowLoadingAction = PayloadAction<c.SHOW_LOADER, Loader>
export type HideLoadingAction = PayloadAction<c.HIDE_LOADER, Loader>
export type ShowErrorAction = PayloadAction<c.SHOW_ERROR, Error>
export type ClearStatusAction = Action<c.CLEAR_STATUS>

export type StatusActions = ShowLoadingAction | HideLoadingAction | ShowErrorAction | ClearStatusAction

export const showLoading = (loader: Loader): ShowLoadingAction => ({
  type: c.SHOW_LOADER,
  payload: loader,
})

export const hideLoading = (loader: Loader): HideLoadingAction => ({
  type: c.HIDE_LOADER,
  payload: loader,
})

export const showError = (error: Error): ShowErrorAction => ({
  type: c.SHOW_ERROR,
  payload: error,
})

export const clearStatus = (): ClearStatusAction => ({
  type: c.CLEAR_STATUS,
})
