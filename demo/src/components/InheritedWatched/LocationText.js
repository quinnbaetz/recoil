import React from 'react';
import UserStore from '../../stores/user_store';
import BaseComponent from '../../recoil/BaseComponent'
import Utils from '../../utils'
export default class LocationText extends BaseComponent {
  render() {

    super.render()
    let user = UserStore.getWatchedObject(this.props.id, this.getId())

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
