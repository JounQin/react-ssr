import React from 'react'
import {renderToString} from 'react-dom/server'
import {createMemoryHistory, match, RouterContext} from 'react-router'

import routes from 'routes'

export default context => {
  const {template, url} = context
  return new Promise((resolve, reject) => {
    const memoryHistory = createMemoryHistory(url)

    match({history: memoryHistory, routes, location: url}, (error, redirectLocation, renderProps) => {
      let status, content

      if (error) {
        content = error.message
        status = 500
      } else if (redirectLocation) {
        content = redirectLocation.pathname + redirectLocation.search
        status = 302
      } else if (renderProps) {
        renderProps.router.ssrContext = context
        const routerContext = <RouterContext {...renderProps}/>
        const app = `<div id="app">${renderToString(routerContext)}</div>`
        content = template.head
        content += context.styles || ''
        content += template.neck
        content += app
        content += template.tail
        status = 200
      } else return reject(error)

      resolve({
        content,
        status
      })
    })
  })
}
