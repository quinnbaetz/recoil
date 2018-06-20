import React, {PureComponent} from 'react';
import UserStore from '../../stores/user_store';
import BaseComponentHOC from '../../recoil/BaseComponentHOC'
import Utils from '../../utils'
import LocationTextNormal from './LocationText'
class UserList extends PureComponent {
  render() {
    return (
      <li
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}
      >
        <span>
          Name: {UserStore.get(this.props.id, "name", this.props.watcherId)}
        </span>
        <span>
          Email: {UserStore.get(this.props.id, "email", this.props.watcherId)}
        </span>
        <LocationTextNormal id={this.props.id}></LocationTextNormal>
      </li>
    )
  }
}

export default BaseComponentHOC(UserList)

