import React from 'react'
import { AsyncComponentProvider } from 'react-async-component'
import asyncBootstrapper from 'react-async-bootstrapper'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from 'App'

const rehydrateState = window.ASYNC_COMPONENTS_STATE

if (!__DEV__) {
  delete window.__INITIAL_STATE__
  delete window.ASYNC_COMPONENTS_STATE
}

const AppContainer = __DEV__
  ? require('react-hot-loader').AppContainer
  : ({ children }) => children

const render = () => {
  const app = (
    <AppContainer>
      <AsyncComponentProvider rehydrateState={rehydrateState}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AsyncComponentProvider>
    </AppContainer>
  )

  asyncBootstrapper(app).then(() =>
    hydrate(app, document.getElementById('app')),
  )
}

render()

if (module.hot) {
  module.hot.accept('App', render)
}

if (
  !__DEV__ &&
  (location.protocol === 'https:' ||
    ['127.0.0.1', 'localhost'].includes(location.hostname)) &&
  navigator.serviceWorker
) {
  navigator.serviceWorker.register('/service-worker.js')
}
