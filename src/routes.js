import 'styles/bootstrap'
import 'styles/app'

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
