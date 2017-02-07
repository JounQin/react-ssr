import React from 'react'
import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'
import {createMemoryHistory, match, RouterContext} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import serialize from 'serialize-javascript'

import routes from 'routes'
import {configureStore} from 'store'

export default (context) => {
  const {template, url} = context
  return new Promise((resolve, reject) => {
    const memoryHistory = createMemoryHistory(url)
    const store = configureStore(memoryHistory)
    const history = syncHistoryWithStore(memoryHistory, store)

    let status, content

    match({history, routes, location: url}, (error, redirectLocation, renderProps) => {
      if (error) {
        status = 500
        content = error.message
      } else if (redirectLocation) {
        status = 302
        content = redirectLocation.pathname + redirectLocation.search
      } else if (renderProps) {
        status = 200
        content = template.head
        const styles = context.styles
        if (styles) content += styles
        content += template.neck
        content += `<div id="app">${renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps}/>
          </Provider>
        )}</div>`

        if (__DEV__) content += '<div id="devtools"></div>'

        content += `<script>window.__initialState__=${serialize(store.getState())};</script>` + template.tail
      } else return reject()

      resolve({
        content,
        status
      })
    })
  })
}
