import React from 'react'
import {withRouter} from 'react-router'

import 'styles/bootstrap'
import 'styles/app'

import empty from 'styles/_empty'

global.withStyle = (comp, style = empty, router = true) => {
  class wrapped extends comp {
    componentWillMount() {
      const {ssrContext} = this.props.router
      ssrContext && style.__inject__ && style.__inject__(ssrContext)
    }
  }
  return router ? withRouter(wrapped) : wrapped
}

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
