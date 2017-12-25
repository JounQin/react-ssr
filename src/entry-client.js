import React from 'react'
import { AsyncComponentProvider } from 'react-async-component'
import asyncBootstrapper from 'react-async-bootstrapper'
import { hydrate } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'

import App from 'App'

const rehydrateState = window.ASYNC_COMPONENTS_STATE

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
  module.hot.accept('./App', render)
}

location.protocol === 'https:' &&
  navigator.serviceWorker &&
  navigator.serviceWorker.register('/service-worker.js')
