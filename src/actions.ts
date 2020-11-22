import { Dictionary } from 'lodash';
import { PayloadAction } from './types';
import { loadConstants } from './constants';

export type SetLoadingAction = PayloadAction<loadConstants.SET_LOADING, string>;
export type RemoveLoadingAction = PayloadAction<loadConstants.REMOVE_LOADING, string>;
export type SetErrorAction = PayloadAction<loadConstants.SET_ERROR, Dictionary<Error>>;
export type RemoveErrorAction = PayloadAction<loadConstants.REMOVE_ERROR, string>;

export const setLoading = (loadingName: string): SetLoadingAction => ({
  type: loadConstants.SET_LOADING,
  payload: loadingName,
});

export const removeLoading = (loadingName: string): RemoveLoadingAction => ({
  type: loadConstants.REMOVE_LOADING,
  payload: loadingName,
});

export const setError = (name: string, error: Error): SetErrorAction => ({
  type: loadConstants.SET_ERROR,
  payload: { [name]: error },
});

export const removeError = (errorName: string): RemoveErrorAction => ({
  type: loadConstants.REMOVE_ERROR,
  payload: errorName,
});
