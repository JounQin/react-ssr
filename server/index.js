import fs from 'fs'

import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import re from 'path-to-regexp'
import _debug from 'debug'

import config, {globals, paths} from '../build/config'

import {intercept, parseTemplate, createRunner} from './utils'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

app.use(compress())
app.use(logger())

let run, template, readyPromise, mfs

const koaVersion = require('koa/package.json').version
const reactVersion = require('react/package.json').version

const INDEX_PAGE = 'index.html'

const NON_SSR_PATTERN = []

const DEFAULT_HEADERS = {
  'Content-Type': 'text/html',
  Server: `koa/${koaVersion}; vue-server-renderer/${reactVersion}`
}

app.use(async (ctx, next) => {
  await readyPromise

  if (intercept(ctx, {logger: __DEV__ && debug})) {
    await next()
    return
  }

  ctx.set(DEFAULT_HEADERS)

  const {res, url} = ctx

  if (NON_SSR_PATTERN.find(pattern => re(pattern).exec(url))) {
    if (__DEV__) {
      ctx.body = mfs.createReadStream(paths.dist(INDEX_PAGE))
    } else {
      ctx.url = INDEX_PAGE
      await next()
    }
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
