import isEmpty from 'lodash.isempty'
import { Loading, StatusState } from './types'

export function loadingStatus<L extends Loading>(state: StatusState): L | null {
  return state._status.loading as L
}

export const isStatusClear = (state: StatusState): boolean =>
  isEmpty(state._status.error) && isEmpty(state._status.loading)

export function errorStatus<E extends Error>(state: StatusState): E | null {
  return state._status.error as E
}
