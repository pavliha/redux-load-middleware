import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { omit } from 'lodash';
import { ErrorAction, GlobalErrorHandler } from './types';
import { deriveErrorsFromAction } from './utils';

export const createLoadMiddleware = (globalErrorHandler?: GlobalErrorHandler) => {
  const loadMiddleware: Middleware = ({ dispatch, getState }: MiddlewareAPI) => (next: Dispatch) => (action) => {
    if (!action.load) return next(action);
    const state = getState();
    const loadAction = omit(action, 'load');
    dispatch({
      ...loadAction,
      type: `${action.type}_PENDING`,
    });
    return action.load
      .then((response: unknown) =>
        dispatch({
          ...loadAction,
          type: `${action.type}_SUCCESS`,
          payload: response,
        }),
      )
      .catch((error: unknown) => {
        const errorAction = {
          ...loadAction,
          type: `${action.type}_ERROR`,
          payload: error,
        } as ErrorAction<string>;
        const hasErrors = globalErrorHandler || errorAction.errors;
        const errors = {
          ...deriveErrorsFromAction(errorAction),
          ...globalErrorHandler?.(state.errors, errorAction),
        };
        return dispatch({ ...errorAction, errors: hasErrors ? errors : undefined });
      });
  };

  return loadMiddleware;
};
