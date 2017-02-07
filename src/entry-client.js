import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {syncHistoryWithStore} from 'react-router-redux'
import {Router, applyRouterMiddleware, browserHistory} from 'react-router'
import {useScroll} from 'react-router-scroll'
import {AppContainer} from 'react-hot-loader'

import {configureStore, routes, DevTools} from './entry'

const store = configureStore(browserHistory, window.__initialState__)

const history = syncHistoryWithStore(browserHistory, store)

const renderApp = () => render(
  <AppContainer>
    <Provider store={store}>
      <Router history={history} routes={routes} render={applyRouterMiddleware(useScroll())}/>
    </Provider>
  </AppContainer>,
  document.getElementById('app')
)

renderApp()

if (__DEV__) {
  render(
    <Provider store={store}>
      <DevTools/>
    </Provider>,
    document.getElementById('devtools')
  )
}

if (module.hot) {
  module.hot.accept('routes', () => {
    require('routes')
    renderApp()
  })
}
