React = require 'react'
List = require 'List'
_ = require 'lodash'

#NEEDED FOR IE
Proxy = require('proxy-polyfill/src/proxy');

class BaseComponent
  constructor: ->
    @objs = {}
    @_modelName = 'Base'
    @_lists = {}
    @_registerList('All', (obj) -> true)

  get: (id, prop, watcherId) ->
    @_registerWatcher(watcherId, null, id, prop)
    return _.get(@objs[id], prop)

  getName: () -> @_modelName

  #TODO: currently this doesn't work for nested properties (e.g. job.service.lat) 
  # as the get property will only be the first key.
  getWatchedObject: (id, watcherId) ->
    if @objs[id]?
      return new Proxy(@objs[id],
        set: (target, property, value) -> console.warn('Currently this is a read only object')
        get: (target, property) => @get(id, property, watcerId)
    else
      @_registerWatcher(watcherId, null, id)
    

  getList: (name, watcherId) ->
    EventRegistry.register(watcherId, name)
    if @_lists[name]?
      return @_lists[name].getList()
    return null

  add: (newObj) ->
    if !@objs[newObj.id]?
      EventRegistry.triggerObjListeners(@getName(), @_list.name, newObj.id)
    @objs[newObj.id] = newObj
    
    #TODO: optimization can be done here by having the list validator subscribe to property listeners
    @_updateLists(newObj)

  update: (newObj, changes) ->
    @add(newObj)
    for change in changes
      EventRegistry.triggerPropListeners(@getName(), null, id, change)

  _registerWatcher: (watcherId, list, id, prop) ->
    EventRegistry.register(watcherId, @getName(), list, id, prop)

  _registerList: (name, validator) ->
    @_lists[name] = new List(name, validator)

  _updateLists: (newObj) ->
    for list in @_lists
      if @_lists.updateListObj(newObj)
        EventRegistry.triggerListListeners(@getName(), @_list.name)


module.exports = BaseComponent