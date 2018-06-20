import React from 'react';
import BaseComponent from '../recoil/BaseComponent'
import HOCUserList from './HOC/UserList'
import HOCWatchedUserList from './HOCWatched/UserList'
import InheritedUserList from './Inherited/UserList'
import InheritedWatchedUserList from './InheritedWatched/UserList'
import TriggerWatcher from './TriggerWatcher/TriggerWatcher'
import UserUpdater from './UserUpdater'
import CSS from './App.css'
import utils from '../utils'
class App extends BaseComponent {
  constructor(props) {
    super(props)

    this.state = {
      tab: 0
    }

    //Just for testing
    setInterval(this.forceUpdate.bind(this), 300)
  }

  renderContent = () => {
    switch(this.state.tab) {
      case 0:
        return (<InheritedUserList />)
      case 1:
        return (<InheritedWatchedUserList />)
      case 2:
        return (<HOCUserList />)
      case 3:
        return (<HOCWatchedUserList />)
      case 4:
        return (<TriggerWatcher />)
    }
  }

  setTab = (e) =>
    this.setState({
      tab: parseInt(e.target.value)
    })

  renderRadioButton = (name, value) => {
    return (
      <span>
        <input type='radio' id={name} name='tab' checked={this.state.tab == value} value={value} />
        <label htmlFor={name}>{name}</label>
      </span>
    )
  }
  renderTabSelector = () => {
    const views = ["Inherited", "Inherited Watched", "HOC", "HOC Watched", "TriggerWatcher"]
    return (
      <div onChange={this.setTab}>
        {views.map((value, index) => {
          return this.renderRadioButton(value, index)
        })}
      </div>
    )
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sample Recoil App</h1>
        </header>

        <UserUpdater></UserUpdater>
        {this.renderTabSelector()}
        {this.renderContent()}
        <div className='watchers'>
          {utils.buildComponentWatchMap().map((value) => {
            return (
              <div>{value}</div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
