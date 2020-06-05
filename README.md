# Redux Load Middleware
Universal error and loading handler for React Apps

Redux Load Middleware enables simple, yet robust handling of async action creators in [Redux](http://redux.js.org). 

## Usage

api.ts
```typescript
export const loginUser = async (values: LoginFormValues):Promise<LoginResponse> => {
  return await http.post('/login',values)
}
```
actions.ts
```typescript
import { LoadAction, PayloadAction } from 'redux-load-middleware'
import { loginUser } from './api'

type LoginAction = LoadAction<c.LOGIN_USER, LoginResponse>
type LoginSuccessAction = PayloadAction<c.LOGIN_USER_SUCCESS, LoginResponse>

export const login = (values: LoginFormValues): LoginAction => ({
  type: c.LOGIN_USER,
  load: loginUser(values),
  options:{
    loader: new ProgressBarLoader(),
    error: new ShackbarLoader()
  }
})
```


contracts.ts
```typescript
 import { AppError, Loader } from 'redux-load-middleware'
 
 export class ProgressBarLoader implements Loader {
   readonly name = 'ProgressBarLoader'
 }
 
 export class SnackbarError extends AppError {
   readonly name = 'SnackbarError'
 }
```

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
  
  if(!error) return  null

  return (
    <div className="snackbar" onClick={handleClose}>
        {error?.message}
    </div>
  )
}
```

TopProgressBarLoading.tsx
```typescript jsx
import React from 'react'
import { useLoader } from 'src/hooks'

export const SnackbarErrorMessage = () => {
  const loader = useLoader(ProgressBarLoader)
  
  if(!loader) return null

  return (
    <div className="top-progress-bar" />
   )
}
```

And then we could add error component created above to anywhere inside app. For example:
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
import auth from './auth/reducer'
import { statusReducer } from 'redux-load-middleware'

const reducer = combineReducers({
  _status: statusReducer,
  auth,
})

export default reducer
```

- Add helper hooks to the project

```typescript jsx
import { useSelector } from 'react-redux'
import { AppError, errorStatus, Loader, loadingStatus } from 'redux-load-middleware'

export const useError = (errorType: Type<AppError>) => {
  const error = useSelector(errorStatus)
  const isSyncError = error instanceof errorType
  if (!isSyncError) return null
  return error
}

export const useLoader = (loaderType: Type<Loader>) => {
  const loading = useSelector(loadingStatus)
  const isCorrectLoader = loading instanceof loaderType
  if (!isCorrectLoader) return null
  return loading
}
```
