import React from 'react'
import {render} from 'react-dom'
import {match, Router, browserHistory} from 'react-router'
import {AppContainer} from 'react-hot-loader'

import routes from 'routes'

const renderApp = () => match({history: browserHistory, routes}, (error, redirectLocation, renderProps) => render(
  <AppContainer>
    <Router {...renderProps}/>
  </AppContainer>,
  document.getElementById('app')
))

renderApp()

if (module.hot) module.hot.accept('routes', renderApp)

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
