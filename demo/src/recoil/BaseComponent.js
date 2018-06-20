import { PureComponent } from 'react';
import EventRegistry from './EventRegistry'
let BC_ID_ITTR = 1;
export default class BaseComponent extends PureComponent {
  constructor(props) {
    super(props);
    this._event_listeners = [];
    this._id = this.createNewWatcher();
    this._mounted = false;
    this.getId = this.getId.bind(this)
    this.getNewWatcherId = this.getNewWatcherId.bind(this)
    this.bindListener = this.bindListener.bind(this)
    this.createNewWatcher = this.createNewWatcher.bind(this)
    //TODO: remove this once rerender is working
    if(!this.state){
      this.state = {}
    }
    this.state.rev = 1
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

  rerender = (watcherId) => {
    //TODO: figure out why reacts force update wasn't working
    this.forceUpdate()
  }

  getId() { return this._id; }
  getNewWatcherId() { return BC_ID_ITTR++; }
  //Registers listeners to be removed automatically and binds
  //TODO: Do we need this, or can we fully commit to recoil?  Perhaps for (LOADED)
  bindListener = (store, name, callback=this.rerender) => {
    this._event_listeners.push({
      store,
      name,
      callback
    });
    if (this._mounted) {
      return store.bind(name, callback);
    }
  }

  createNewWatcher = (callback=this.rerender) => {
    const watcher_id = this.getNewWatcherId();
    this.bindListener(EventRegistry, watcher_id, callback);
    return watcher_id;
  }




  // This is added for clarity and so that it can be overriden instead of using purecomponent
  // TODO: determine if this ^ is the right decision



  render() {
    return EventRegistry.clearTriggers(this.getId());
  }
}
