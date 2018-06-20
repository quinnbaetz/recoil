import React from 'react';
import UserStore from '../../stores/user_store';
import BaseComponent from '../../recoil/BaseComponent'
import Utils from '../../utils'
import LocationTextWatched from './LocationText'
export default class UserList extends BaseComponent {
  render() {
    super.render()

    const user = UserStore.getWatchedObject(this.props.id, this.getId())

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
        <LocationTextWatched id={this.props.id}></LocationTextWatched>
      </li>
    )

  }
}
