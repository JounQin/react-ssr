import { asyncComponent } from 'react-async-component'
import { renderRoutes } from 'react-router-config'

import 'styles/app'

const resolver = resolve => asyncComponent({ resolve })

const routes = [
  {
    path: '/',
    exact: true,
    component: resolver(() => import('views/Home')),
  },
]

const App = () => renderRoutes(routes)

export default App
