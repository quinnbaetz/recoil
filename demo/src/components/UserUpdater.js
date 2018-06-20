import React, {Component} from 'react';
import UserStore from '../stores/user_store';
import BaseComponent from '../recoil/BaseComponent'

let userId = 0

export default class UserUpdater extends BaseComponent {
  constructor(props) {
    super(props)
  }
  loadUsers = () => {
    for(let i = 0; i<10; i++){
      this.addUser()
    }
  }
  addUser() {
    UserStore.add({
      id: userId++,
      name: `User ${userId}`,
      email: `email${userId}@gmail.com`,
      location: {
        address: `Test Address ${userId}`,
        state: "MO"
      }
    })
  }
  removeUser() {
    UserStore.remove(userId-1);
    userId--;
  }
  updateRandomUserName() {
    const updateUserId = Math.floor(Math.random()*(userId-1))
    console.log(updateUserId)
    const obj = {
      id: updateUserId,
      name: UserStore.get(updateUserId, "name")+"1"
    }

    UserStore.update(obj, ['name'])
  }
  updateRandomUserNameWithoutChange() {
    const updateUserId = Math.floor(Math.random()*(userId-1))
    const obj = {
      id: updateUserId,
      name: UserStore.get(updateUserId, "name")+"1"
    }
    UserStore.update(obj)
  }

  updateRandomUserAddress() {
    const updateUserId = Math.floor(Math.random()*(userId-1))
    const obj = {
      id: updateUserId,
      location: {
        address: UserStore.get(updateUserId, "location.address")+"1"
      }
    }

    UserStore.update(obj, ['location.address'])
  }
  updateRandomUserAddressWithoutChange() {
    const updateUserId = Math.floor(Math.random()*(userId-1))
    const obj = {
      id: updateUserId,
      location: {
        address: UserStore.get(updateUserId, "location.address")+"1"
      }
    }
    UserStore.update(obj)
  }

  updateWatchedObjectName() {
    const updateUserId = Math.floor(Math.random()*(userId-1))
    let user = UserStore.getWatchedObject(updateUserId)
    user.name = user.name + "1"
  }

  updateWatchedObjectAddress() {
    const updateUserId = Math.floor(Math.random()*(userId-1))
    let user = UserStore.getWatchedObject(updateUserId)
    let location = user.location
    location.address = user.location.address + "1"
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.loadUsers}>Load Users</button>
          <button onClick={this.removeUser}>Remove User</button>
          <button onClick={this.addUser}>Add User</button>
        </div>
        <div>
          <button onClick={this.updateRandomUserName}>Update Random Users Name With Change</button>
          <button onClick={this.updateRandomUserNameWithoutChange}>Update Random Users Name Without Change</button>
          <button onClick={this.updateWatchedObjectName}>Update Random Watched Objects Name</button>
        </div>
        <div>
          <button onClick={this.updateRandomUserAddress}>Update Random Users Address With Change</button>
          <button onClick={this.updateRandomUserAddressWithoutChange}>Update Random Users Address Without Change</button>
          <button onClick={this.updateWatchedObjectAddress}>Update Random Watched Objects Address</button>
        </div>
       </div>
    )

  }
}
