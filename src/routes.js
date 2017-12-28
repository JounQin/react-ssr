import axios from 'axios'
import React from 'react'
import { asyncComponent } from 'react-async-component'
import { withRouter } from 'react-router'
import { renderRoutes } from 'react-router-config'

import 'styles/bootstrap'
import 'styles/app'

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
