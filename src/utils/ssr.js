import axios from 'axios'
import hoistStatics from 'hoist-non-react-statics'
import React from 'react'
import { withRouter } from 'react-router'

import empty from 'styles/_empty'

export const withSsr = (styles = empty, router = true) => Component => {
  class WrappedComponent extends React.PureComponent {
    componentWillMount() {
      if (styles && styles.__inject__) {
        styles.__inject__(this.props.staticContext)
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          http={__SERVER__ ? this.props.staticContext.axios : axios}
        />
      )
    }
  }

  return hoistStatics(
    router ? withRouter(WrappedComponent) : WrappedComponent,
    Component,
  )
}
