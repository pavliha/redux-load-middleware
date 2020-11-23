import React from 'react'
import './App.css'
import { LoginFormContainer } from '../LoginFormContainer'
import { AlertContainer } from '../AlertContainer'
import { Provider } from 'react-redux'
import store from '../../store'

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Redux Load Middleware example</h1>
        <div className="container">
          <LoginFormContainer />
        </div>
        <AlertContainer />
      </div>
    </Provider>
  )
}

export default App
