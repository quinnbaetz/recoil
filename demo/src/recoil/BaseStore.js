import React from 'react'
import List from './List'
import _ from 'lodash'
import EventRegistry from './EventRegistry'

//NEEDED FOR IE (FIGURE THIS OUT)
//import Proxy from 'proxy-polyfill/src/proxy'

export default class BaseStore {
  constructor(props={}) {
    this.objs = {};
    this._modelName = 'Base';
    this._lists = {};
    this._registerList('All', obj => true);
  }

  get(id, prop, watcherId) {
    this._registerWatcher(watcherId, id, prop);
    return _.get(this.objs[id], prop);
  }

  getName() { return this._modelName; }

  getWrappedStore(watcherId) {
    const watcherFilledIn = {
      get: _.partial(this.get, _, _, watcherId),
      getWatchedObject: _.partial(this.getWatchedObject, _, watcherId, _),
      getList: _.partial(this.getList, _, watcherId),
    }
    //HACK: to get the same interface as the BaseStore
    watcherFilledIn.__proto__ = this
    return watcherFilledIn
  }

  getList(name='All', watcherId=null) {
    EventRegistry.register(watcherId, this.getName(), name);
    if (this._lists[name] != null) {
      return this._lists[name].getList();
    }
    return null;
  }

  add(newObj) {
    if ((this.objs[newObj.id] == null)) {
      this._triggerListeners(newObj.id);
    }
    this.objs[newObj.id] = newObj;

    //TODO: optimization can be done here by having the list validator subscribe to property listeners
    return this._updateLists(newObj);
  }

  remove(id) {
    this._triggerListeners(id);
    delete this.objs[id]

    //TODO: optimization can be done here by having the list validator subscribe to property listeners
    return this._removeFromLists(id);

  }

  //Takes a partial object and triggers any properties looking at it's listeners
  update(newObj, changes=null) {
    if(!newObj || typeof newObj.id == 'undefined' ){
      console.warn("attempt to update an invalid object: ", newObj)
      return
    }
    const { id } = newObj;
    const oldObj = this.objs[id];
    const joinedObj = _.merge({}, oldObj, newObj)

    if (changes != null) {
      //Prefered performance method
      for (let change of changes) {
        this._triggerListeners(id, change);
      }
    } else { //FALLBACK
      //If we don't know what's changed, just look through the things we are watching (if any) and trigger those
      //If they've changed
      const props = EventRegistry.getWatchedProperties(this.getName(), id);
      for (let prop of props) {
        if (_.get(oldObj, prop) != _.get(joinedObj, prop)) {
          this._triggerListeners(id, prop);
        }
      }
    }
    //This can likely be improved _.mergeWith allows you to specify your own logic
    return this.add(joinedObj);
  }

  getWatchedObject(id, watcherId, path="") {
    let value = this.objs[id];
    if (path.length > 0) {
      value = _.get(this.objs[id], path); //remove the trailing .
    }
    if (value != null) {
      return new Proxy(value, {
        get: _.bind(this._proxyGet, this, _, _, id, path, watcherId),
        set: _.bind(this._proxySet, this, _, _, _, id, path, watcherId)
      }
      );
    } else {
      //Wait for this object to exist
      this._registerWatcher(watcherId, id);
    }
  }

  _proxyGet(target, prop, id, path="", watcherId=null) {
    const value = _.get(target, prop);
    const route = path ? path+"."+prop : prop

    console.log("VALUE: ", target, prop, id, path, watcherId, value)
    if (typeof(value) === "object") {
      console.log("Object is value")
      return this.getWatchedObject(id, watcherId, route);
    } else {
      console.log("Object is plain text")
      return this.get(id, route, watcherId);
    }
  }

  _proxySet(target, prop, value, id, path="", watcherId=null) {

    const route = path ? path+"."+prop : prop

    const item = {
      id: id,
      [route]: value
    }

    this.update(item, [route]);
    return true;
  }

  _triggerListeners(objId=null, property=null) {
    return EventRegistry.triggerListeners(this.getName(), objId, property);
  }

  _registerWatcher(watcherId, id, prop) {
    return EventRegistry.register(watcherId, this.getName(), id, prop);
  }

  _registerList(name, validator) {
    return this._lists[name] = new List(name, validator);
  }

  _removeFromLists(id) {
    for (let list of Object.values(this._lists)) {
      if (list.removeFromList(id)) {
        this._triggerListeners(list.name);
      }
    }
  }
  _updateLists(newObj) {
    for (let list of Object.values(this._lists)) {
      if (list.updateListObj(newObj)) {
        this._triggerListeners(list.name);
      }
    }
  }
}
