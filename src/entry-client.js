import React from 'react'
import {render} from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'
import {useScroll} from 'react-router-scroll'
import {AppContainer} from 'react-hot-loader'

import reducers from 'store/reducers'
import routes from 'routes'

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
)

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

if (module.hot) {
  module.hot.accept('routes', () => {
    require('routes')
    renderApp()
  })
}

