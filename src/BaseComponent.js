import React from 'react'
import EventRegistry from 'event_registry'

let BC_ID_ITTR = 1;
class BaseComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this._event_listeners = [];
    this._id = this.createNewWatcher();
    this._mounted = false;
  }

  componentDidMount() {
    //Set up any registered listeners for component
    if (this._event_listeners) {
      for (let trigger of this._event_listeners) {
        trigger.store.bind(trigger.name, trigger.callback);
      }
    }
    return this._mounted = true;
  }
  componentWillUnmount() {
    //Remove registered listeners
    if (this._event_listeners) {
      return this._event_listeners.map((trigger) =>
        trigger.store.unbind(trigger.name, trigger.callback));
    }
  }

  getId = () => { return this._id; }
  getNewWatcherId = () => { return BC_ID_ITTR++; }

  //Registers listeners to be removed automatically and binds
  //TODO: Do we need this, or can we fully commit to recoil?  Perhaps for (LOADED)
  bindListener = (store, name, callback=this.forceUpdate) => {
    this._event_listeners.push({
      store,
      name,
      callback
    });
    if (this._mounted) {
      return store.bind(name, callback);
    }
  }

  createNewWatcher = (callback=this.forceUpdate) => {
    const watcher_id = this.getNewWatcherId();
    this.bindListener(EventRegistry, watcher_id, callback);
    return watcher_id;
  }

  render() {
    return EventRegistry.clearTriggers(this.getId());
  }
}

export BaseComponent;
