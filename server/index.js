import fs from 'fs'

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

import intercept from './intercept'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

const flag = true

if (!flag) app.use(require('./history').default())
app.use(compress())
app.use(logger())

function parseTemplate(template, contentPlaceholder = '<div id="app">') {
  if (typeof template === 'object') {
    return template
  }

  let i = template.indexOf('</head>')
  const j = template.indexOf(contentPlaceholder)

  if (j < 0) {
    throw new Error(`Content placeholder not found in template.`)
  }

  if (i < 0) {
    i = template.indexOf('<body>')
    if (i < 0) {
      i = j
    }
  }

  return {
    head: template.slice(0, i),
    neck: template.slice(i, j),
    tail: template.slice(j + contentPlaceholder.length)
  }
}

let configureStore, routes, template

if (flag) {
  app.use(async(ctx, next) => {
    const {req, res} = ctx

    if (flag && (!routes || !configureStore)) return res.end('waiting for compilation... refresh in a moment.')

    if (intercept(ctx)) return await next()

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
        let content = template.head + template.neck

        content += `<div id="app">${renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps}/>
          </Provider>
        )}</div>`

        content += `<script>window.__initialState__=${serialize(store.getState())};</script>` + template.tail

        ctx.status = 200
        res.end(content)
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
  template = parseTemplate(fs.readFileSync(paths.dist('index.html')).toString())
  configureStore = bundle.configureStore
  routes = bundle.routes
  app.use(serve('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
