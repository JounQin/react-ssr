import React from 'react'
import ReactDom from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route, browserHistory} from 'react-router'
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'
import {AppContainer} from 'react-hot-loader'

import App from 'App'
import reducers from 'store/reducers'

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
)

const history = syncHistoryWithStore(browserHistory, store)

ReactDom.render(
  <AppContainer>
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}/>
      </Router>
    </Provider>
  </AppContainer>,
  document.getElementById('app')
)
