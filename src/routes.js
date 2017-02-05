import React from 'react'

import App from 'App'

const resolve = (module, callback, route) =>
  module.then(({default: component}) => callback(null, route ? {component} : component))

export default {
  path: '/',
  component: App,
  getIndexRoute(partialNextState, callback) {
    resolve(System.import('components/Home'), callback, true)
  },
  childRoutes: [
    {
      path: 'test',
      getComponent(nextState, callback) {
        resolve(System.import('components/Test'), callback)
      }
    }
  ]
}
