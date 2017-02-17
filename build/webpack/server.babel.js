import webpack from 'webpack'
import BabiliPlugin from 'babili-webpack-plugin'
import SsrPlugin from 'ssr-webpack-plugin'
import _debug from 'debug'

import config, {globals, paths, pkg} from '../config'

import base from './base'

const {NODE_ENV} = globals

const debug = _debug('hi:webpack:server')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}`)

const serverConfig = {
  ...base,
  target: 'node',
  devtool: false,
  entry: paths.src('entry-server.js'),
  output: {
    ...base.output,
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    ...base.plugins,
    new webpack.DefinePlugin({
      ...globals,
      __SERVER__: true
    }),
    new SsrPlugin()
  ],
  externals: Object.keys(pkg.dependencies)
}

config.minimize && serverConfig.plugins.push(new BabiliPlugin())

export default serverConfig
