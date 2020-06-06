import isEmpty from 'lodash.isempty'
import { Loader, StatusState } from './types'

export function loadingStatus<L extends Loader>(state: StatusState): L | null {
  return state._status.loader as L
}

export const isStatusClear = (state: StatusState): boolean =>
  isEmpty(state._status.error) && isEmpty(state._status.loader)

export function errorStatus<E extends Error>(state: StatusState): E | null {
  return state._status.error as E
}
