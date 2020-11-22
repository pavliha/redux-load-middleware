
export interface Dictionary<T> {
  [index: string]: T;
}

export type LoadingsState = Dictionary<boolean>;

export type ErrorsState<Message = unknown> = Dictionary<Message>;

export type MiddlewareStore = {
  loadings: LoadingsState;
  errors: ErrorsState;
};

export type ErrorHandler = (error: Error) => ErrorsState;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GlobalErrorHandler<Error = any> = (state: ErrorsState, action: ErrorAction<string, Error>) => ErrorsState;


export interface Action<T = string, R = unknown> {
  type: T;
  payload?: R;
  loading?: string;
  errors?: ErrorsState | ErrorHandler;
}

export interface LoadAction<T, R = unknown> extends Action<T, R> {
  load: Promise<R>;
}

export interface PayloadAction<T, R> extends Action<T> {
  payload: R;
}

export type PendingAction<T> = Action<T>;

export interface ErrorAction<T, E = Error> extends Action<T> {
  payload: E;
}
export type Meta<T> = { meta: T };
