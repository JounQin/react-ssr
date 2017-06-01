import fs from 'fs'

import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import _debug from 'debug'

import config, {globals, paths} from '../build/config'

import {intercept, parseTemplate, createRunner} from './utils'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

app.use(compress())
app.use(logger())

let run, template, readyPromise
let mfs // eslint-disable-line

app.use(async (ctx, next) => {
  await readyPromise

  const {res, url} = ctx

  if (intercept(ctx, {logger: __DEV__ && debug})) {
    await next()
    return
  }

  try {
    const context = {url, template}
    const {status, content} = await run(context)
    ctx.status = status
    res[status === 302 ? 'redirect' : 'end'](content)
  } catch (e) {
    ctx.status = 500
    res.end('internal server error')
    console.error(e)
  }
})

if (__DEV__) {
  readyPromise = require('./dev').default(app, (bundle, {template: temp, fs}) => {
    mfs = fs
    run = createRunner(bundle)
    template = parseTemplate(temp)
  })
} else {
  mfs = fs
  run = createRunner(require(paths.dist('ssr-bundle.json')))
  template = parseTemplate(fs.readFileSync(paths.dist('index.html'), 'utf-8'))
  app.use(serve('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
