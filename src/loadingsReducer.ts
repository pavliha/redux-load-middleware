import { LoadingsState } from './types';
import omit from 'lodash.omit';
import { endsWithError, endsWithPending, endsWithSuccess } from './utils';
import { RemoveLoadingAction, SetLoadingAction, RemoveErrorAction } from './actions';
import { loadConstants } from './constants';

type LoadingActions = SetLoadingAction | RemoveLoadingAction | RemoveErrorAction;

const INITIAL_STATE: LoadingsState = {};

export const loadingsReducer = (state = INITIAL_STATE, action: LoadingActions): LoadingsState => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case loadConstants.SET_LOADING:
      return { ...state, [action.payload]: true };
    case loadConstants.REMOVE_LOADING:
      return omit(state, action.payload);
  }

  const name = action?.loading;

  if (!name) return state;

  if (endsWithPending(action.type)) {
    return { ...state, [name]: true };
  }

  if (endsWithSuccess(action.type)) {
    return omit(state, name);
  }

  if (endsWithError(action.type)) {
    return omit(state, name);
  }
  return state;
};
