import { Action } from 'redux'
import { statusReducer } from './reducer'

export class GeneralError extends Error {
  public name: string
  public message: string
  constructor(message: string) {
    super()
    Object.setPrototypeOf(this, GeneralError.prototype)
    Error.captureStackTrace(this, GeneralError)
    this.name = 'GeneralError'
    this.message = message
  }
}

export interface Type<T> extends Function {
  new (...args: any[]): T
}

export interface Loading {
  readonly name: string
}

export interface LoadAction<Type, Response, Meta = {}> extends Action {
  type: Type
  load: Promise<Response>
  meta?: Meta
  options?: {
    fallbackError?: Error
    loading?: Loading
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
