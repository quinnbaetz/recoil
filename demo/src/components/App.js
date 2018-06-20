import React, { Component } from 'react';
import BaseComponent from '../recoil/BaseComponent'
import UserListNormal from './UserListNormal'
import UserListWatched from './UserListWatched'
import UserUpdater from './UserUpdater'
import CSS from './App.css'
class App extends BaseComponent {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sample Recoil App</h1>
        </header>
        <UserUpdater></UserUpdater>
        <UserListNormal></UserListNormal>
        <UserListWatched></UserListWatched>
      </div>
    );
  }
}

export default App;
