import axios from 'axios'
import React from 'react'
import { asyncComponent } from 'react-async-component'
import { withRouter } from 'react-router'
import { renderRoutes } from 'react-router-config'

import 'styles/bootstrap'
import 'styles/app'

import empty from 'styles/_empty'

const proto = React.Component.prototype

if (__SERVER__) {
  Object.defineProperty(proto, '$ssrContext', {
    configurable: __DEV__,
    get() {
      return this.props.staticContext
    },
  })

  Object.defineProperty(proto, '$http', {
    configurable: __DEV__,
    get() {
      return this.$ssrContext.axios
    },
  })
} else {
  Object.defineProperty(proto, '$http', {
    value: axios,
    writable: __DEV__,
  })
}

global.withStyle = (Component, style = empty, router = true) => {
  class WrappedComponent extends Component {
    componentWillMount() {
      if (style.__inject__) {
        style.__inject__(this.$ssrContext)
      }
    }
  }

  return router ? withRouter(WrappedComponent) : WrappedComponent
}

const resolver = resolve => asyncComponent({ resolve })

export default [
  {
    component: ({ route }) => renderRoutes(route.routes),
    routes: [
      {
        path: '/',
        exact: true,
        component: resolver(() => import('views/Home')),
      },
    ],
  },
]
