import React from 'react'
import asyncBootstrapper from 'react-async-bootstrapper'
import {
  AsyncComponentProvider,
  createAsyncContext,
} from 'react-async-component'
import { StaticRouter } from 'react-router'

import App from 'App'

export default context =>
  new Promise(async (resolve, reject) => {
    const { ctx } = context

    const asyncContext = (context.asyncContext = createAsyncContext())

    const app = (
      <AsyncComponentProvider asyncContext={asyncContext}>
        <StaticRouter location={ctx.url} context={context}>
          <App />
        </StaticRouter>
      </AsyncComponentProvider>
    )

    try {
      await asyncBootstrapper(app)
      const { status, url } = context
      if (status || url) {
        return reject(context)
      }
    } catch (e) {
      return reject(e)
    }

    resolve(app)
  })
