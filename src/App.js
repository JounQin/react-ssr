import React, {PureComponent} from 'react'
import {IndexLink, Link} from 'react-router'

export default class extends PureComponent {
  static propTypes = {
    children: React.PropTypes.element
  }

  render() {
    return (<div>
      First Step
      <br/>
      <IndexLink to="/">Home</IndexLink>
      <Link to="/test">Test</Link>
      {this.props.children}
    </div>)
  }
}
