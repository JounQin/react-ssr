import React, {PureComponent} from 'react'

export default class extends PureComponent {
  static propTypes = {
    children: React.PropTypes.element
  }

  render() {
    return (<div>
      First Step
      {this.props.children}
    </div>)
  }
}
