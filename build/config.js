import path from 'path'

export const NODE_ENV = process.env.NODE_ENV || 'development'

export const __DEV__ = NODE_ENV === 'development'

export const hashType = __DEV__ ? 'hash' : 'contenthash'

export const serverHost = '0.0.0.0'

export const serverPort = process.env.PORT || 4000

export const publicPath = '/'

export const resolve = (...args) => path.resolve(process.cwd(), ...args)

export const runtimeRequire =
  // eslint-disable-next-line camelcase
  typeof __non_webpack_require__ === 'undefined'
    ? require // eslint-disable-next-line camelcase,no-undef
    : __non_webpack_require__
