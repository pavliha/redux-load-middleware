import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLoadMiddleware } from 'redux-load-middleware'
import reducers from './reducer'

const loadMiddleware = createLoadMiddleware()

const store = createStore(reducers, composeWithDevTools(applyMiddleware(loadMiddleware)))

export default store
