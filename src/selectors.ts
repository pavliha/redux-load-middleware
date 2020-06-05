import isEmpty from 'lodash.isempty'
import { Loader, StatusState } from './types'

export const loadingStatus = (state: StatusState): Loader | null => state._status.loader

export const isStatusClear = (state: StatusState): boolean => isEmpty(state._status.error) && isEmpty(state._status.loader)

export const errorStatus = (state: StatusState): Error | null => state._status.error
