import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
import pug from 'pug'
import _debug from 'debug'

import config, {globals, paths, pkg, vendors} from '../config'

import base from './base'

const {browsers, devTool, minimize} = config

const sourceMap = !!devTool

const {NODE_ENV, __DEV__} = globals

const debug = _debug('hi:webpack:client')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}`)

const cssMinimize = minimize && {
  autoprefixer: {
    add: true,
    remove: true,
    browsers
  },
  discardComments: {
    removeAll: true
  },
  safe: true,
  sourcemap: sourceMap
}

const STYLUS_LOADER = 'stylus-loader?paths=node_modules/bootstrap-styl/'

let bootstrapLoader

const sourceLoaders = [{
  loader: 'css-loader',
  options: {
    minimize,
    sourceMap,
    ...cssMinimize
  }
}, STYLUS_LOADER]

const clientConfig = {
  ...base,
  target: 'web',
  entry: {
    app: [paths.src('entry-client')],
    vendors
  },
  module: {
    rules: [
      ...base.module.rules,
      {
        test: /\.styl$/,
        use: minimize ?
          (bootstrapLoader = new ExtractTextPlugin('bootstrap.[contenthash].css')).extract({
            fallback: 'style-loader',
            use: sourceLoaders
          }) : ['style-loader', ...sourceLoaders]
      }
    ]
  },
  plugins: [
    ...base.plugins,
    new webpack.DefinePlugin({
      ...globals,
      __SERVER__: false
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors'),
    new HtmlWebpackPlugin({
      templateContent: pug.renderFile(paths.src('index.pug'), {
        pretty: !minimize,
        title: `${pkg.name} - ${pkg.description}`,
        polyfill: !__DEV__
      }),
      favicon: paths.src('static/favicon.ico'),
      hash: false,
      inject: true,
      minify: {
        collapseWhitespace: minimize,
        minifyJS: minimize
      }
    })
  ]
}

if (minimize) {
  debug(`Enable plugins for ${NODE_ENV} (UglifyJS).`)

  clientConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: !sourceMap,
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      },
      comments: false,
      sourceMap
    }),
    bootstrapLoader
  )
}

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')

  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  debug(`Enable plugins for ${NODE_ENV} (SWPrecache).`)

  clientConfig.plugins.push(
    new SWPrecacheWebpackPlugin({
      cacheId: 'vue-ssr',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  )
}

export default clientConfig
