import React, {PureComponent} from 'react';
import BaseComponentHOC from '../../recoil/BaseComponentHOC'
import Utils from '../../utils'
class LocationText extends PureComponent {
  render() {
    console.log( this.props.watchedStores.UserStore.getWatchedObject)
    let user = this.props.watchedStores.UserStore.getWatchedObject(this.props.id)
    return (
      <span
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}>
        <span>
          Address: {user.location.address}
        </span>
        <span>
          State:  {user.location.state}
        </span>
      </span>
    )
  }
}

export default BaseComponentHOC(LocationText)
