import _axios from 'axios'
import React from 'react'
import asyncBootstrapper from 'react-async-bootstrapper'
import {
  AsyncComponentProvider,
  createAsyncContext,
} from 'react-async-component'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import serialize from 'serialize-javascript'

import App from 'App'

export default context =>
  new Promise(async (resolve, reject) => {
    const start = __DEV__ && Date.now()

    const { ctx } = context
    const { url } = ctx

    const axios = _axios.create()

    axios.defaults.headers = ctx.headers

    Object.assign(context, { axios })

    const asyncContext = createAsyncContext()

    const app = (
      <AsyncComponentProvider asyncContext={asyncContext}>
        <StaticRouter location={url} context={context}>
          <App />
        </StaticRouter>
      </AsyncComponentProvider>
    )

    await asyncBootstrapper(app)

    let status, content

    if (context.url) {
      content = context.url
      status = 302
    } else {
      content = `<div id="app">${renderToString(
        app,
      )}</div><script>window.ASYNC_COMPONENTS_STATE=${serialize(
        asyncContext.getState(),
      )}</script>`
    }

    __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)

    resolve({ content, status })
  })
