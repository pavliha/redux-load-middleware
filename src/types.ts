import { Action } from 'redux'
import { statusReducer } from './reducer'

export abstract class AppError extends Error {
  abstract readonly name: string
}

export interface Type<T> extends Function {
  new (...args: any[]): T
}

export interface Loader {
  readonly name: string
}

export interface LoadAction<Type, Response, Meta = {}> extends Action {
  type: Type
  load: Promise<Response>
  meta?: Meta
  options?: {
    error?: Error
    loader?: Loader
  }
}

export interface PayloadAction<Type, Response, Meta = {}> extends Action {
  type: Type
  payload: Response
  meta?: Meta
}

export type StatusState = {
  _status: ReturnType<typeof statusReducer>
}
