import React from 'react';
import UserStore from '../../stores/user_store';
import BaseComponent from '../../recoil/BaseComponent'
import Utils from '../../utils'
export default class LocationText extends BaseComponent {
  render() {
    super.render()
    return (
      <span
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}>
        <span>
          Address: {UserStore.get(this.props.id, "location.address", this.getId())}
        </span>
        <span>
          State:  {UserStore.get(this.props.id, "location.state", this.getId())}
        </span>
      </span>
    )
  }
}
