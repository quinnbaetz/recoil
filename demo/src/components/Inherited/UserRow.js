import React from 'react';
import UserStore from '../../stores/user_store';
import BaseComponent from '../../recoil/BaseComponent'
import Utils from '../../utils'
import LocationTextNormal from './LocationText'
export default class UserList extends BaseComponent {
  render() {
    super.render()
    return (
      <li
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}
      >
        <span>
          Name: {UserStore.get(this.props.id, "name", this.getId())}
        </span>
        <span>
          Email: {UserStore.get(this.props.id, "email", this.getId())}
        </span>
        <LocationTextNormal id={this.props.id}></LocationTextNormal>
      </li>
    )

  }
}
