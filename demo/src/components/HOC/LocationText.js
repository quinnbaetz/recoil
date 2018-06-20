import React, {PureComponent} from 'react';
import UserStore from '../../stores/user_store';
import BaseComponentHOC from '../../recoil/BaseComponentHOC'
import Utils from '../../utils'
class LocationText extends PureComponent {
  render() {
    return (
      <span
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}>
        <span>
          Address: {UserStore.get(this.props.id, "location.address", this.props.watcherId)}
        </span>
        <span>
          State:  {UserStore.get(this.props.id, "location.state", this.props.watcherId)}
        </span>
      </span>
    )
  }
}

export default BaseComponentHOC(LocationText)
