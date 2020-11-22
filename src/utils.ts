import { ErrorAction, MiddlewareStore } from './types'

export function createLoadingSelector(name: string) {
  return (state: MiddlewareStore) => state.loadings[name];
}

export function createErrorSelector<T>(name: string) {
  return (state: MiddlewareStore) => state.errors[name] as T;
}

export function endsWithPending(actionType: string) {
  return Boolean(/_PENDING$/.test(actionType));
}

export function endsWithSuccess(actionType: string) {
  return Boolean(/_SUCCESS$/.test(actionType));
}

export function endsWithError(actionType: string) {
  return Boolean(/_ERROR$/.test(actionType));
}


const isFunction = <T,>(fn: T)=> typeof fn === 'function'

const deriveErrorEntries = (payload: Error) => ([key, errorOrTransformer]: [
  string,
  unknown | ((error: Error) => unknown),
]) => {
  const message = isFunction(errorOrTransformer) ? (errorOrTransformer as ((error: Error) => unknown))(payload) : errorOrTransformer;
  return [key, message];
};

export const deriveErrorsFromAction = (action: ErrorAction<string>) => {
  const entries = Object.entries(action.errors ?? {});
  return Object.fromEntries(entries.map(deriveErrorEntries(action.payload)));
};
