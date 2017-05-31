import React from 'react'

import 'styles/bootstrap'
import 'styles/app'

const proto = React.PureComponent.prototype

proto.$inject = function (style, ssrContext) {
  ssrContext = ssrContext || this.$ssrContext
  ssrContext && style.__inject__ && style.__inject__(ssrContext)
}

proto.hasOwnProperty('$ssrContext') || Object.defineProperty(proto, '$ssrContext', {
  get() {
    const {props} = this
    return (props.routes || props).ssrContext
  }
})

const resolve = (promise, callback) => promise.then(module => callback(null, module.default))

export default {
  path: '/',
  getIndexRoute(partialNextState, callback) {
    import('views/Home').then(module => callback(null, {component: module.default}))
  },
  childRoutes: [
    {
      path: 'counter',
      getComponent(nextState, callback) {
        resolve(import('views/Counter'), callback)
      }
    }
  ]
}
