import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import MFS from 'memory-fs'
import webpackDev from './webpack-dev'
import webpackHot from './webpack-hot'
import config, {paths} from '../../build/config'
import {clientConfig, serverConfig} from '../../build/webpack'

export default (app, opts) => {
  clientConfig.entry.app.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client')

  const clientCompiler = webpack(clientConfig)

  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: config.publicPath,
    hot: true,
    quiet: config.quiet,
    noInfo: config.quiet,
    lazy: false,
    stats: config.stats
  })

  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem
    const filePath = paths.dist('index.html')
    if (fs.existsSync(filePath)) opts.templateUpdated(fs.readFileSync(filePath, 'utf-8'))
  })

  app.use(webpackDev(clientCompiler, devMiddleware))
  app.use(webpackHot(clientCompiler))

  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    // eslint-disable-next-line no-eval
    opts.bundleUpdated(eval(mfs.readFileSync(paths.dist('server-bundle.js'), 'utf-8')))
  })
}
