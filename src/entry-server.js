import React from 'react'
import {renderToString} from 'react-dom/server'
import {createMemoryHistory, match, RouterContext} from 'react-router'

import routes from 'routes'

export default context => new Promise((resolve, reject) => {
  const {url} = context.ctx

  match({history: createMemoryHistory(url), routes, location: url}, (error, redirectLocation, renderProps) => {
    let status, content

    if (error) return reject(error)

    if (redirectLocation) {
      content = redirectLocation.pathname + redirectLocation.search
      status = 302
    } else {
      renderProps.router.ssrContext = context
      content = renderToString(<RouterContext {...renderProps}/>)
    }

    resolve({content, status})
  })
})
