import { Dictionary, omit } from 'lodash';
import { deriveErrorsFromAction, endsWithError, endsWithPending } from './utils';
import { RemoveErrorAction, RemoveLoadingAction, SetErrorAction } from './actions';
import { loadConstants } from './constants';
import { ErrorAction, ErrorsState, PendingAction } from './types';

type ErrorActions =
  | PendingAction<string>
  | RemoveLoadingAction
  | SetErrorAction
  | RemoveErrorAction
  | ErrorAction<string>;

const INITIAL_STATE: ErrorsState = {};

export const errorsReducer = (state = INITIAL_STATE, action: ErrorActions): ErrorsState => {
  if (action.type === loadConstants.SET_ERROR) {
    return {
      ...state,
      ...(action.payload as Dictionary<Error>),
    };
  }

  if (action.type === loadConstants.REMOVE_ERROR) {
    return omit(state, action.payload as string);
  }

  if (endsWithPending(action.type)) {
    if (!action.errors) return state;
    return omit(state, Object.keys(action.errors));
  }

  if (endsWithError(action.type)) {
    return { ...state, ...deriveErrorsFromAction(action as ErrorAction<string>) };
  }

  return state;
};
