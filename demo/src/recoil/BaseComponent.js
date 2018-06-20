import { PureComponent } from 'react';
import EventRegistry from './EventRegistry'
let BC_ID_ITTR = 1;

//TEMP HACK FOR TESTING: Track component names
window.componentNames = {}

export default class BaseComponent extends PureComponent {
  constructor(props) {
    super(props);
    this._event_listeners = [];
    this._id = this.createWatcher();
    this._mounted = false;
    this.getId = this.getId.bind(this)
    this.getNewWatcherId = this.getNewWatcherId.bind(this)
    this.bindListener = this.bindListener.bind(this)
    this.createWatcher = this.createWatcher.bind(this)
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
        EventRegistry.bind(trigger.name, trigger.callback);
      }
    }
    return this._mounted = true;
  }
  componentWillUnmount() {
    //Remove registered listeners
    if (this._event_listeners) {
      return this._event_listeners.map((trigger) =>
        EventRegistry.unbind(trigger.name));
    }
  }

  //TODO: Fix Hack / This is so that the HOC can overload with the correct scoping
  rerender() {
    this.forceUpdate()
  }
  _rerender = (watcherId) => {
    this.rerender()
  }

  getId() { return this._id; }
  getNewWatcherId() { return BC_ID_ITTR++; }
  //Registers listeners to be removed automatically and binds
  //Currently being used for binding to the EventRegistry by passing an ID and callback
  //TODO: Should also work for stores
  bindListener = (name, callback=this._rerender) => {
    this._event_listeners.push({
      name,
      callback
    });
    if (this._mounted) {
      return EventRegistry.bind(name, callback);
    }
  }

  createInspectionHack(id, additions="") {
    window.componentNames[id] = this.constructor.name + "(" + additions + ")"
  }

  createWatcher = (callback=this._rerender) => {
    //if not rerender create a new watcher ID
    const watcherId = this.getNewWatcherId();
    this.bindListener(watcherId, callback);
    this.createInspectionHack(watcherId, callback.name)
    return watcherId;
  }

  bindToStore = (store, name, callback=this._rerender) => {
    const watcherId = this.createWatcher(callback)
    store.registerEventWatcher(watcherId, name)
  }


  render() {
    return EventRegistry.clearTriggers(this.getId());
  }
}
