import React, {PureComponent} from 'react';
import UserStore from '../../stores/user_store';
import BaseComponentHOC from '../../recoil/BaseComponentHOC'
import Utils from '../../utils'
import UserRowNormal from './UserRow'
class UserList extends PureComponent {
  render() {
    let userIds = this.props.watchedStores.UserStore.getList('All')

    return (
      <ul
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}
      >
        {userIds.map((id)=>{
          return (<UserRowNormal key={id} id={id}></UserRowNormal>)
        })}
      </ul>
    )

  }
}


export default BaseComponentHOC(UserList)
