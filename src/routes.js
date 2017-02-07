import React from 'react'

import App from 'App'

const resolve = (module, callback, route) => {
  if (module.then) {
    module.then(({default: component}) => callback(null, route ? {component} : component))
  } else {
    const {default: component} = module
    callback(null, route ? {component} : component)
  }
}

export default {
  path: '/',
  component: App,
  getIndexRoute(partialNextState, callback) {
    resolve(__DEV__ ? require('components/Home') : System.import('components/Home'), callback, true)
  },
  childRoutes: [
    {
      path: 'test',
      getComponent(nextState, callback) {
        resolve(__DEV__ ? require('components/Test') : System.import('components/Test'), callback)
      }
    }
  ]
}
