# Redux Load Middleware
Error and loading handler for React Apps

See example project [here](https://github.com/pavliha/redux-load-middleware/tree/master/examples/basic)

Redux Load Middleware enables simple, yet robust handling of async action creators in [Redux](http://redux.js.org). 

I wrote redux-load-middleware to make basic stuff like error and loading handling seamless. So you could focus on stuff that matters.

#### Why not redux-saga?
It possible and even encouraged to use redux-load-middleware in conjunction with redux-saga. Think of redux-load-middleware as it's just util that handles loading and errors for you, for many other things you can use redux-saga.
It is quite verbose to write async calls with saga you have to write try-catch all the time. And error and loading handling often mix with business logic as a result it becomes harder to read sagas.

Saga can be used for other things like calling other actions after updating the state. Which is the same as what you did before, just excluding error/loading handling.

#### Why not redux-promise-middleware?
redux-load-middleware works in the same way as redux-promise-middleware. With redux-promise-middleware you have to handle loading and errors manually. The redux-load-middleware has it is own errorsReducer and loadingsReducer to which you just connect with selectors.
## Installation
- Connect `loadMiddleware` to the store
```typescript
import { createLoadMiddleware } from 'redux-load-middleware'

const loadMiddleware = createLoadMiddleware()
const store = createStore(reducers, compose(applyMiddleware(loadMiddleware)))
```
- Add `loadingsReducer` and `errorsReducer` to your reducers
```typescript
// store.ts
import { combineReducers } from 'redux'
import { loadingsReducer, errorsReducer } from 'redux-load-middleware'

const reducer = combineReducers({
  loadings: loadingsReducer,
  errors: errorsReducer,
  //...your other reducers
})

export default reducer
```

## Getting Started
#### Adding loading handler
Create action with `load` property that accepts `Promise`.
Then come up with a name for `loading`. It is convenient to use the same name as action name. 
```typescript
// actions.ts
import { LoadAction } from 'redux-load-middleware'
type LoginUserAction = LoadAction<c.LOGIN_USER>;

export const loginUser = (): LoginUserAction => ({
  type: 'LOGIN_USER',
  load: api.user.login(), // returns Promise<User>
  loading: 'loginUser', // this name will be used to reterive loading status from loadingsReducer
});
```
When you `dispatch` load user action `LOGIN_USER_PENDING`
will be dispatched and in `loadings` state will set `loginUser` to `true`
```js
{
  loadings: {
    loginUser: true 
  }
}
```
With your selector just connect to `loadings` state. No need to handle loading in your reducer.
```typescript
import { createLoadingSelector } from 'redux-load-middleware'
  
export const selectUserLoading = createLoadingSelector('loginUser')
```
After `Promise` resolves `LOGIN_USER_SUCCESS` will be dispatched with `payload: User`. So you can just listen for `LOGIN_USER_SUCCESS`, ether from your reducer or sagas. 
```typescript
import { PayloadAction } from 'redux-load-middleware'
import { User } from 'api'

const LoginUserSuccessAction = PayloadAction<'LOGIN_USER_SUCCESS', User>;

const authReducer = (state, action: LoginUserSuccessAction)=>{
    switch (action){
      case 'LOGIN_USER_SUCCESS':
        return {
          user: action.payload
        }
    default:
       return state
    }
}
```

Action `LOGIN_USER_SUCCESS` will also remove `loginUser` from `loadings`.
```js
{
  loadings: { }
}
```

#### Adding error handling
Add `errors` property action
Then come up with a name for `loading`. It is convenient to use the same name as action name. 
```typescript
// actions.ts
import { LoadAction } from 'redux-load-middleware'
import { loginUserErrors } from './errors'
export type LoginUserAction = LoadAction<c.LOGIN_USER>;

export const loginUser = (): LoginUserAction => ({
  type: 'LOGIN_USER',
  load: api.user.login(),
  loading: 'loginUser',
  errors: loginUserErrors
});
```
Create errors object and come up with a name for error that your UI will handle for example `alertError`.
```typescript
// errors.ts
import { HttpError, AxiosError } from 'api'

export const loginUserErrors = {
  // any error can me accepted
  alertError: (error: Error): string | undefined => {
    if(!(error instanceof  HttpError)) return
    if(error.type === ErrorTypes.DEVICE_OFFLINE) return 'Your device offline!'
    return 'Something happened. Try again later'
  },
  // you can return any data type string used here as an example
  formError: (error: AxiosError): string | undefined => { 
     // your data from api response for example 'This email already taken!'
    const message = error?.response?.message
    if(message) return message
  } 
}
```
When you `dispatch` `loginUser` action and `Promise` gets rejected `LOGIN_USER_ERROR`
will be dispatched and in `errors` state will set `alertError` to 
```js
{
  loadings: {}
  errors: {  
    alertError: 'Your device is offline!'
    // OR if form error has occured
    formError: 'This email already taken!'
  }
}
```
You can retrieve error message from state using `createErrorSelector` helper using `alertError` key.
```typescript
import { createErrorSelector } from 'redux-load-middleware';
import { createSelector, Selector } from 'reselect';
import { State } from 'src/store/reducer';


export const selectAlertErrorMessage: Selector<State, string | null> = createSelector(
  createErrorSelector('alertError'),
  (message) => message ? message : null,
);

export const selectFormErrorMessage: Selector<State, string | null> = createSelector(
  createErrorSelector('formError'),
  (message) => message ? message : null,
);
```

In case `LOGIN_USER_SUCCESS` errors will be cleared.
#### Setting errors manually

Create custom error
```typescript
import { setError, setLoading } from 'redux-load-middleware';
import { createSelector, Selector } from 'reselect';

class AnyError extends Error{
  data: any
  constructor(data) {
    super('error message');
    this.data = data
  }
}
```
In order to dispatch error with your custom data
```typescript
import { setError } from 'react-load-middleware'

dispatch(setError('manualError', { any: 'data' }))
```
This will dispatch `SET_ERROR` action and update store
```js
{
  errors: {  
    manualError:  { any: 'data' }
  }
}
```
To remove error from `errors` state
```typescript
import { removeError } from 'react-load-middleware'

dispatch(removeError('loginUser'))
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

