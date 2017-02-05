import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import _debug from 'debug'

import config, {globals} from '../build/config'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

app.use(compress())
app.use(logger())

if (__DEV__) {
  require('./dev').default(app, {
    bundleUpdated() {},
    templateUpdated() {}
  })
} else {
  app.use(serve('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
