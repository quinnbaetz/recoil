import React from 'react';
import UserStore from '../../stores/user_store';
import BaseComponent from '../../recoil/BaseComponent'
import Utils from '../../utils'
import UserRowWatched from './UserRow'
export default class UserList extends BaseComponent {
  render() {
    super.render()
    const store = UserStore.getWrappedStore(this.getId())
    return (
      <ul
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}
      >
        {store.getList('All').map((id)=>{
          return (<UserRowWatched key={id} id={id}></UserRowWatched>)
        })}
      </ul>
    )

  }
}
