import webpack from 'webpack'

import config, {alias, globals, paths} from '../config'

const {__PROD__} = globals

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

const {devTool, minimize} = config

export const prodEmpty = str => __PROD__ ? '' : str

const filename = `${prodEmpty('[name].')}[${config.hashType}].js`

const urlLoader = `url-loader?${JSON.stringify({
  limit: 10000,
  name: `${prodEmpty('[name].')}[hash].[ext]`
})}`

const nodeModules = /\bnode_modules\b/

export default {
  resolve: {
    modules: [paths.src(), PACKAGES, NODE_MODULES],
    extensions: ['.js', '.styl'],
    enforceExtension: false,
    enforceModuleExtension: false,
    alias
  },
  resolveLoader: {
    modules: [PACKAGES, NODE_MODULES]
  },
  output: {
    path: paths.dist(),
    publicPath: config.publicPath,
    filename,
    chunkFilename: filename
  },
  devtool: devTool,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
        exclude: nodeModules
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: urlLoader + '!img-loader?minimize&progressive=true'
      },
      {
        test: /\.(svg|woff2?|eot|ttf)$/,
        loader: urlLoader
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize,
      stylus: {
        default: {
          import: [paths.src('styles/_variables.styl')]
        }
      }
    })
  ]
}
