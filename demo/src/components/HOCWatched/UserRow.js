import React, {PureComponent} from 'react';
import UserStore from '../../stores/user_store';
import BaseComponentHOC from '../../recoil/BaseComponentHOC'
import Utils from '../../utils'
import LocationTextNormal from './LocationText'
class UserList extends PureComponent {
  render() {
    let user = this.props.watchedStores.UserStore.getWatchedObject(this.props.id)
    return (
      <li
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}
      >
        <span>
          Name: {user.name}
        </span>
        <span>
          Email: {user.email}
        </span>
        <LocationTextNormal id={this.props.id}></LocationTextNormal>
      </li>
    )
  }
}

export default BaseComponentHOC(UserList)

