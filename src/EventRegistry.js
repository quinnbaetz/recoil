
import _  from 'lodash'

class EventRegistry {
  static initClass() {
    //Used as a quick lookup for any watchers associated with a change
    this.prototype._watchedEvents = {};
    //Used as a quick lookup for any events associated with a watcher
    this.prototype._watcherToEvents = {};
    //Used as a throttling mechanism for updates
    this.prototype._pendingTriggerIds = [];
    //A map of watchers to their callbacks
    this.prototype._binds = {};
    this.prototype._triggerTimeouts = {};
  }
  constructor() {
    this.triggerListener = this.triggerListener.bind(this)
    this.sendPendingTriggers = this.sendPendingTriggers.bind(this)
    this.register = this.register.bind(this)
    this.bind = this.bind.bind(this)
    this.unbind = this.unbind.bind(this)
    this.triggerListeners = this.triggerListeners.bind(this)
    this.getWatchedProperties = this.getWatchedProperties.bind(this)
    this.triggerPropListeners = this.triggerPropListeners.bind(this)
    this.triggerObjListeners = this.triggerObjListeners.bind(this)
    this.clearTriggers = this.clearTriggers.bind(this)

  }
  register(watcherId, modelId, objId=null, property=null) {
    if (watcherId != null) {
      const eventKey = [modelId, objId, property, watcherId];
      this._createNestedMap(...Array.from(eventKey || []));

      if ((this._watcherToEvents[watcherId] == null)) {
        this._watcherToEvents[watcherId] = [];
      }

      return this._watcherToEvents[watcherId].push(eventKey);
    }
  }

  bind(watcherId, callback) {
    return this._binds[watcherId] = callback;
  }

  unbind(watcherId) {
    delete this._binds[watcherId];
    return this.clearTriggers(watcherId);
  }

  triggerListener(watcherId) {
    if (this._binds[watcherId]) {
      return this._binds[watcherId](watcherId);
    }
  }

  sendPendingTriggers(id) {
    this.triggerListener(id);
    return delete this._triggerTimeouts[id];
  }

  //Adds a slight delay to callbacks, so that we can dedupe
  //Deduping is important in case there are many property changes that come in at once (albeit a tiny bit hacky)
  triggerListeners(modelId, objId=null, property=null) {
    const watcherIds = this._getKeys(modelId, objId, property);
    console.log("TRIGGERING LISTENERS: ", modelId, objId, property, watcherIds)
    for (let id of watcherIds) {
      if (this._triggerTimeouts[id]) {
        clearTimeout(this._triggerTimeouts[id]);
      }

      //TODO: implement count so it eventually sends every no matter if it's getting continous updates
      this._triggerTimeouts[id] = setTimeout(_.partial(this.sendPendingTriggers, id), 20);
    }
  }

  //These trigger any watchers registered to passed in properties
  triggerPropListeners(modelId, objId, property) {
    return this.triggerListeners(modelId, objId, property);
  }
  triggerObjListeners(modelId, objId) {
    return this.triggerListeners(modelId, objId, null);
  }

  getWatchedProperties(modelId, objId) {
    const idPropertyWatchers = this._getKeys(modelId, objId);
    const generalPropertyWatchers = this._getKeys(modelId, null);
    const watchedProps = idPropertyWatchers.concat(generalPropertyWatchers);
    return watchedProps;
  }

  //Removes all the associated
  clearTriggers(watcherId) {
    if (watcherId != null) {
      if (this._watcherToEvents[watcherId]) {
        //TODO: might be more performant to just delete the leaf node here and
        //      prune the rest of the path later (essentially garbage collect when memory gets low)
        //      alternatively if every child only has one child we can prune the parent node
        for (let keys of this._watcherToEvents[watcherId]) {
          this._prunePath(this._watchedEvents, keys);
        }
      }

      return delete this._watcherToEvents[watcherId];
    }
  }

  //removes an entire path of a tree if it's empty
  _prunePath(tree, path) {
    if (_.isEmpty(_.get(tree, path))) {
      this._removeNode(tree, path);
      return this._prunePath(tree, path.slice(0, -1));
    }
  }

  //removes a specific node given a path into the tree
  _removeNode(tree, path) {
    if(tree){
      if (path.length === 1) {
        delete tree[path[0]];
        return;
      }
      return this._removeNode(tree[path[0]], path.slice(1));
    }
  }

  //Drills in and gets all keys for a watcher
  _getKeys(...args) {
    let base = this._watchedEvents;
    for (let arg of args) {
      if (!base[arg]) {
        return [];
      }

      base = base[arg];
    }
    return _.keys(base);
  }

  //Creates a nesting if it doesn't already exist
  //(e.g. (one, two, three ) becomes {one: {two: {three: {}}})
  _createNestedMap(...args) {
    let base = this._watchedEvents;
    for (let arg of args) {
      base = (base[arg] = base[arg] || {});
    }
    return base;
  }
}
EventRegistry.initClass();

const eventRegistry = new EventRegistry();
window.er = eventRegistry
export default eventRegistry;
