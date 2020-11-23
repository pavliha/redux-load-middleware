# Redux Load Middleware
Error and loading handler for React Apps

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
type LoadUserAction = LoadAction<c.LOAD_USER>;

export const loadUser = (): LoadUserAction => ({
  type: 'LOAD_USER',
  load: api.user.load(), // returns Promise<User>
  loading: 'loadUser', // this name will be used to reterive loading status from loadingsReducer
});
```
When you `dispatch` load user action `LOAD_USER_PENDING`
will be dispatched and in `loadings` state will set `loadUser` to `true`
```js
{
  loadings: {
    loadUser: true 
  }
}
```
With your selector just connect to `loadings` state. No need to handle loading in your reducer.
```typescript
import { createLoadingSelector } from 'redux-load-middleware'
  
export const selectUserLoading = createLoadingSelector('loadUser')
```
After `Promise` resolves `LOAD_USER_SUCCESS` will be dispatched with `payload: User`. So you can just listen for `LOAD_USER_SUCCESS`, ether from your reducer or sagas. 
```typescript
import { PayloadAction } from 'redux-load-middleware'
import { User } from 'api'

const LoadUserSuccessAction = PayloadAction<'LOAD_USER_SUCCESS', User>;

const authReducer = (state, action: LoadUserSuccessAction)=>{
    switch (action){
      case 'LOAD_USER_SUCCESS':
        return {
          user: action.payload
        }
    default:
       return state
    }
}
```

Action `LOAD_USER_SUCCESS` will also remove `loadUser` from `loadings`.
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
import { loadUserErrors } from './errors'
export type LoadUserAction = LoadAction<c.LOAD_USER>;

export const loadUser = (): LoadUserAction => ({
  type: 'LOAD_USER',
  load: api.user.load(),
  loading: 'loadUser',
  errors: loadUserErrors
});
```
Create errors object and come up with a name for error that your UI will handle for example `alertError`.
```typescript
// errors.ts
import { HttpError } from 'api'

const loadUserErrors = {
  alertError: (error: Error): string | undefined => {
    if(!(error instanceof  HttpError)) return
    if(error.type === ErrorTypes.DEVICE_OFFLINE) return 'Your device offline!'
    if(error.type === ErrorTypes.FORBIDDEN) return 'Please authorize first!'
  },
  formError: (error: Error) => {} // your logic for hadling form errors
}
```
When you `dispatch` `loadUser` action and `Promise` gets rejected `LOAD_USER_ERROR`
will be dispatched and in `errors` state will set `alertError` to 
```js
{
  loadings: {}
  errors: {  
    alertError: 'Please authorize first!'
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
```

In case `LOAD_USER_SUCCESS` errors will be cleared.


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

