import React from 'react';
import UserStore from '../../stores/user_store';
import BaseComponent from '../../recoil/BaseComponent'
import Utils from '../../utils'
import UserRowNormal from './UserRow'
export default class UserList extends BaseComponent {
  render() {
    super.render()
    return (
      <ul
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}
      >
        {UserStore.getList('All', this.getId()).map((id)=>{
          return (<UserRowNormal key={id} id={id}></UserRowNormal>)
        })}
      </ul>
    )

  }
}
