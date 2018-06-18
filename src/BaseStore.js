import React from 'react'
import List from 'List'
import _ from 'lodash'

//NEEDED FOR IE
import Proxy from 'proxy-polyfill/src/proxy'

class BaseStore {
  constructor(props={}) {
    this.objs = {};
    this._modelName = 'Base';
    this._lists = {};
    this._registerList('All', obj => true);
  }

  get(id, prop, watcherId) {
    this._registerWatcher(watcherId, null, id, prop);
    return _.get(this.objs[id], prop);
  }

  getName() { return this._modelName; }

  getWatchedObject(id, watcherId, path="") {
    let value = this.objs[id];
    if (path.length > 0) {
      value = _.get(this.objs[id], path);
    }

    if (value != null) {
      return new Proxy(value, {
        set: _.partialRight(this.proxySet, id, path),
        get: _.partialRight(this.proxyGet, id, path)
      }
      );
    } else {
      //Wait for this object to exist
      return this._registerWatcher(watcherId, id);
    }
  }


  proxyGet(target, prop, id, path="") {
    const value = _.get(target, prop);
    if (typeof(value) === "Object") {
      return this.getWatchedObject(id, watcherId, path+prop+".");
    } else {
      return this.get(id, path+prop, watcherId);
    }
  }


  proxySet(target, prop, value, id, path="") {
    const item = _.get(this.objs[id], path+prop);
    _.set(item, path+prop, value);
    //TODO: if value is an object we need to trigger all watchers on all of it's properties as well
    return this.update(item, path+prop);
  }

  getList(name, watcherId) {
    EventRegistry.register(watcherId, name);
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

  //Takes a partial object and triggers any properties looking at it's listeners
  update(newObj, changes=null) {
    if (changes != null) {
      //Prefered performance method
      for (let change of changes) {
        this._triggerListeners(id, change);
      }
    } else { //FALLBACK
      //If we don't know what's changed, just look through the things we are watching (if any) and trigger those
      //If they've changed
      var { id } = newObj;
      const oldObj = this.objs[id];

      const props = EventRegistry.getWatchedProperties(this.getName(), id);

      for (let prop of props) {
        if (_.get(oldObj, prop) !== _.get(newObj, prop)) {
          this._triggerListeners(id, prop);
        }
      }
    }

    return this.add(newObj);
  }

  _triggerListeners(objId=null, property=null) {
    return this.triggerListeners(this.getName(), objId, property);
  }

  _registerWatcher(watcherId, id, prop) {
    return EventRegistry.register(watcherId, this.getName(), id, prop);
  }

  _registerList(name, validator) {
    return this._lists[name] = new List(name, validator);
  }

  _updateLists(newObj) {
    return (() => {
      const result = [];
      for (let list of this._lists) {
        if (this._lists.updateListObj(newObj)) {
          result.push(this._triggerListeners(this._list.name));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}

export BaseStore;
