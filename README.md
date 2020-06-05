# Redux Load Middleware

[![Build Status](https://travis-ci.org/pburtchaell/redux-promise-middleware.svg?branch=master)](https://travis-ci.org/pburtchaell/redux-promise-middleware) [![npm downloads](https://img.shields.io/npm/dm/redux-promise-middleware.svg?style=flat)](https://www.npmjs.com/package/redux-promise-middleware)

Redux Load Middleware enables simple, yet robust handling of async action creators in [Redux](http://redux.js.org). 

```js
const asyncAction = () => ({
  type: 'PROMISE',
  load: new Promise(...),
})
```

Given a single action with an async payload, the middleware transforms the action to a separate pending action and a separate fulfilled/rejected action, representing the states of the async action.
