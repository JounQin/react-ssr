import fs from 'fs'

import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import _debug from 'debug'
import runInVm from 'run-in-vm'

import config, {globals, paths} from '../build/config'

import intercept from './intercept'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

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

let run, template

app.use(async (ctx, next) => {
  const {req, res} = ctx

  if (!run || !template) {
    ctx.status = 200
    return res.end('waiting for compilation... refresh in a moment.')
  }

  if (intercept(ctx)) return await next()

  try {
    const context = {url: req.url, template}
    const {status, content} = await run(context)
    ctx.status = status
    res[status === 302 ? 'redirect' : 'end'](content)
    res.end(content)
  } catch (e) {
    ctx.status = 500
    res.end('internal server error')
    console.error(e)
  }
})

if (__DEV__) {
  require('./dev').default(app, {
    bundleUpdated: bundle => (run = runInVm({bundle})),
    templateUpdated: temp => (template = parseTemplate(temp))
  })
} else {
  run = runInVm({bundle: require(paths.dist('ssr-bundle.json'))})
  template = parseTemplate(fs.readFileSync(paths.dist('index.html'), 'utf-8'))
  app.use(serve('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
