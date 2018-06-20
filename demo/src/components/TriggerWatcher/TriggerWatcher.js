import React, {PureComponent} from 'react';
import UserStore from '../../stores/user_store';
import BaseComponentHOC from '../../recoil/BaseComponentHOC'
import Utils from '../../utils'
class TriggerWatcher extends PureComponent {
  constructor(props) {
    super(props)
    props.bindToStore(UserStore, UserStore.LOADED)
    props.bindToStore(UserStore, UserStore.RANDOMIZE_ID, this.updateState)
    this.state = {
      rev: 1
    }
  }
  updateState = () => {
    this.setState({rev: this.state.rev+1})
  }
  render() {
    return (
      <ul
        style={{
          backgroundColor: Utils.getRandomColor(),
          padding: 10
        }}
      >
        Loaded Trigger {this.state.rev}
      </ul>
    )

  }
}


export default BaseComponentHOC(TriggerWatcher)
