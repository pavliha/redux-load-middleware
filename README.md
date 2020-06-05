# Redux Load Middleware

Redux Load Middleware enables simple, yet robust handling of async action creators in [Redux](http://redux.js.org). 

```js
const asyncAction = () => ({
  type: 'PROMISE',
  load: new Promise(...),
})
```

Given a single action with an async payload, the middleware transforms the action to a separate pending action and a separate fulfilled/rejected action, representing the states of the async action.
