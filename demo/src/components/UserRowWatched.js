import React, {Component} from 'react';
import UserStore from '../stores/user_store';
import BaseComponent from '../recoil/BaseComponent'
import Utils from '../utils'
import LocationTextWatched from './LocationTextWatched'
export default class UserListNormal extends BaseComponent {
  render() {

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
