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
        status = 500
        content = error.message
      } else if (redirectLocation) {
        status = 302
        content = redirectLocation.pathname + redirectLocation.search
      } else if (renderProps) {
        status = 200
        content = template.head
        content += context.styles || ''
        content += template.neck
        const routerContext = <RouterContext {...renderProps}/>
        content += `<div id="app">${renderToString(routerContext)}</div>`
        content += template.tail
      } else return reject(error)

      resolve({
        content,
        status
      })
    })
  })
}
