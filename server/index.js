import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import _debug from 'debug'

import React from 'react'
import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'
import {createMemoryHistory, match, RouterContext} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import serialize from 'serialize-javascript'

import config, {globals, paths} from '../build/config'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

const flag = __DEV__

if (!flag) app.use(require('./history').default())
app.use(compress())
app.use(logger())

const HTML = ({content, store}) => (
  <html>
  <body>
  <div id="app" dangerouslySetInnerHTML={{__html: content}}/>
  <div id="devtools"/>
  <script dangerouslySetInnerHTML={{__html: `window.__initialState__=${serialize(store.getState())};`}}/>
  </body>
  </html>
)

let configureStore, routes

if (flag) {
  app.use(async (ctx, next) => {
    const {req, res} = ctx

    if (flag && (!routes || !configureStore)) return res.end('waiting for compilation... refresh in a moment.')

    const memoryHistory = createMemoryHistory(req.url)
    const store = configureStore(memoryHistory)
    const history = syncHistoryWithStore(memoryHistory, store)

    match({history, routes, location: req.url}, (error, redirectLocation, renderProps) => {
      if (error) {
        ctx.status = 500
        res.end(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        const content = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps}/>
          </Provider>
        )
        res.end('<!doctype html>\n' + renderToString(<HTML content={content} store={store}/>))
      }
    })
  })
}

if (__DEV__) {
  require('./dev').default(app, {
    bundleUpdated() {},
    templateUpdated() {}
  })
} else {
  const bundle = require(paths.dist('server-bundle.js'))

  console.log(bundle)

  configureStore = bundle.configureStore
  routes = bundle.routes
  app.use(serve('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
