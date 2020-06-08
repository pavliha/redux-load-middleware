# Redux Load Middleware
Universal error and loading handler for React Apps

Redux Load Middleware enables simple, yet robust handling of async action creators in [Redux](http://redux.js.org). 

[Example project](https://github.com/pavliha/partymaker-new-admin). 

## Usage

api.ts
```typescript
export const loginUser = async (values: LoginFormValues): Promise<LoginResponse> => {
  try {
    const loginResponse = await http.post('/login', values)
    return loginResponse
  } catch (error) {
    if(error.code === 401){
      throw new UnauthorizedError(error.message,error.response.data)
    }
    if(error.code === 500){
      throw new SnackbarError('Internal server error. Please try again later')
    }
    throw new SnackbarError('Connection error')  
  }
}
```

Defined errors will be caught by `loadMiddleware` and then be added to `_status: statusReducer` where component can catch thrown errors with `useError` hook

contracts.ts
```typescript
import { Loading, GeneralError } from 'redux-load-middleware' 

 /*
    export abstract class GeneralError extends Error {
      abstract readonly name: string
    }
 */

// We need to extend all Errors, we want to use inside React Components, from GeneralError because loadMiddleware would check if it instanceOf AppError

export class ProgressBarLoader implements Loading {
   readonly name = 'ProgressBarLoading'
}

export class CoverError extends GeneralError {  // Just a regular `Error` with name property added and typescript fixes
  readonly name = 'CoverError'
}

export class SnackbarError extends GeneralError {
   readonly name = 'SnackbarError'
 }

export class UnauthorizedError extends GeneralError {
  readonly name = 'UnauthorizedError'
  readonly fields: FieldErrors[]
  constructor(message: string, fields: FieldErrors[]) {
    super(message)
    this.fields = fields
  }
}

```

While promise is pending `SHOW_LOADING` action would be dispatched with loader from `options` property.
Similar to to [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware).
After promise is successfully resolved `loadMiddleware` would append `_SUCCESS` suffix and dispatch `LOGIN_USER_SUCCESS` action.
In case promise was rejected middleware would dispatch  `SHOW_ERROR` action that updates `_status` state which error or loader components are listening for.


actions.ts
```typescript
import { LoadAction, PayloadAction } from 'redux-load-middleware'
import { loginUser } from './api'

type LoginAction = LoadAction<c.LOGIN_USER, LoginResponse>
type LoginSuccessAction = PayloadAction<c.LOGIN_USER_SUCCESS, LoginResponse>

export const login = (values: LoginFormValues): LoginAction => ({
  type: c.LOGIN_USER,
  load: loginUser(values), // 
  options:{
    loader: new FormLoading(),
    fallbackError: new ShackbarError('custom error message') // fallback error in case general Error was thrown
  }
})
```

### Options API
| Property        | Type                 | Description                           |
| -------------   |:-------------        |:-------------                         |
| loader          |```Type<Loader>```    | Should be instanceof Loader interface |
| error           | ```Type<AppError>``` | Should be instanceof AppLoader class  |

This error component via `useError` hook will depend on `_status` state which in turn `loadMiddleware` would update based on promise from `loginUser` http request

SnackbarErrorMessage.tsx
```typescript jsx
import React from 'react'
import { clearStatus } from 'redux-load-middleware'
import { useDispatch } from 'react-redux'
import { SnackbarError } from 'src/store/contracts'
import { useError } from 'src/hooks'

export const SnackbarErrorMessage = () => {
  const error = useError(SnackbarError)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(clearStatus())
  }
  
  if(!error) return null

  return (
    <div className="snackbar" onClick={handleClose}>
        {error.message}
    </div>
  )
}
```

TopProgressBarLoading.tsx
```typescript jsx
import React from 'react'
import { useLoading } from 'src/hooks'

export const ProgressBarLoader = () => {
  const loading = useLoading(ProgressBarLoading)
  
  if(!loading) return null

  return (
    <div className="top-progress-bar" />
   )
}
```

And then we could add error component created above to anywhere inside app. For example:
App.tsx
```typescript jsx
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { LoginPage, SnackbarErrorMessage, TopProgressBarLoading } from 'src/components'

const App = () => {
  return (
      <ReduxProvider store={store}>
        <TopProgressBarLoading/>
        <BrowserRouter>
          <Switch>
            <Route path="/auth/login" component={LoginPage}/>
          </Switch>
        </BrowserRouter>
        <SnackbarErrorMessage />
      </ReduxProvider>
  )
}

export default App
```


## Setup
- Connect `loadMiddleware` to the store
```typescript
import { loadMiddleware } from 'redux-load-middleware'

const store = createStore(reducers, compose(applyMiddleware(loadMiddleware)))
```
- Add `statusReducer` to the your reducers
```typescript
import { combineReducers } from 'redux'
import { statusReducer } from 'redux-load-middleware'
import auth from './auth/reducer'

const reducer = combineReducers({
  _status: statusReducer,
  auth,
})

export default reducer
```

- Add helper hooks to the project

```typescript jsx
import { useSelector } from 'react-redux'
import { GeneralError, errorStatus, loadingStatus, Loading, Type } from 'redux-load-middleware'
import { State } from 'src/store'

export function useError<E extends GeneralError>(errorType: Type<E>): E | null {
  const error = useSelector((state: State) => errorStatus<E>(state))
  const isSelectedError = error?.name === errorType.name
  if (!isSelectedError) return null
  return error
}

export function useLoading<L extends Loading>(loadingType: Type<L>): L | null {
  const loading = useSelector((state: State) => loadingStatus<L>(state))
  const isSelectedLoading = loading?.name === loadingType.name
  if (!isSelectedLoading) return null
  return loading
}
```
## MIT License

Copyright (c) 2020 Pavel Kostyuk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

