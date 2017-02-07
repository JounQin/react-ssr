import webpack from 'webpack'
import _debug from 'debug'

import {globals, paths, pkg} from '../config'

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
    })
  ],
  externals: Object.keys(pkg.dependencies)
}

export default serverConfig
