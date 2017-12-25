import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'

import 'styles/bootstrap'
import 'styles/app'

import empty from 'styles/_empty'

const proto = React.Component.prototype

if (!__DEV__ || !proto.hasOwnProperty('$ssrContext')) {
  Object.defineProperty(proto, '$ssrContext', {
    get() {
      return this.props.router.ssrContext
    },
  })
}

if (__SERVER__) {
  if (!__DEV__ || !proto.hasOwnProperty('$http')) {
    Object.defineProperty(proto, '$http', {
      get() {
        return this.$ssrContext.axios
      },
    })
  }
} else {
  Object.defineProperty(proto, '$http', { value: axios })
}

global.withStyle = (Component, style = empty, router = true) => {
  class WrappedComponent extends Component {
    componentWillMount() {
      style.__inject__ && style.__inject__(this.$ssrContext)
    }
  }

  return router ? withRouter(WrappedComponent) : WrappedComponent
}

const resolve = (promise, callback, context) =>
  promise.then(async module => {
    const component = module.default

    if (context) {
      const { asyncData } = component.WrappedComponent.prototype
      asyncData && (await asyncData(context))
    }

    callback(null, component)
  })

export default context => ({
  path: '/',
  getIndexRoute(partialNextState, callback) {
    import('views/Home').then(async module => {
      const component = module.default

      if (context) {
        const { asyncData } = component.prototype
        asyncData && (await asyncData(context))
      }

      callback(null, { component })
    })
  },
  childRoutes: [
    {
      path: 'counter',
      getComponent(nextState, callback) {
        resolve(import('views/Counter'), callback, context)
      },
    },
  ],
})
