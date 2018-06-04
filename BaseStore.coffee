React = require 'react'
List = require 'List'
_ = require 'lodash'

#NEEDED FOR IE
Proxy = require('proxy-polyfill/src/proxy');

class BaseComponent
  constructor: (props={}) ->
    @objs = {}
    @_modelName = 'Base'
    @_lists = {}
    @_registerList('All', (obj) -> true)

  get: (id, prop, watcherId) ->
    @_registerWatcher(watcherId, null, id, prop)
    return _.get(@objs[id], prop)

  getName: () -> @_modelName

  getWatchedObject: (id, watcherId, path="") ->
    value = @objs[id]
    if path.length > 0
      value = _.get(@objs[id], path)

    if value?
      return new Proxy(value,
        set: _.partialRight(@proxySet, id, path)
        get: _.partialRight(@proxyGet, id, path)

    else
      #Wait for this object to exist
      @_registerWatcher(watcherId, id)


  proxyGet: (target, prop, id, path="") ->
    value = _.get(target, prop)
    if typeof(value) == "Object"
      return @getWatchedObject(id, watcherId, path+prop+".")
    else
      return @get(id, path+prop, watcherId)


  proxySet: (target, prop, value, id, path="") ->
    item = _.get(@objs[id], path+prop)
    _.set(item, path+prop, value)
    #TODO: if value is an object we need to trigger all watchers on all of it's properties as well
    @update(item, path+prop)

  getList: (name, watcherId) ->
    EventRegistry.register(watcherId, name)
    if @_lists[name]?
      return @_lists[name].getList()
    return null

  add: (newObj) ->
    if !@objs[newObj.id]?
      @_triggerListeners(newObj.id)
    @objs[newObj.id] = newObj

    #TODO: optimization can be done here by having the list validator subscribe to property listeners
    @_updateLists(newObj)

  #Takes a partial object and triggers any properties looking at it's listeners
  update: (newObj, changes=null) ->
    if changes?
      #Prefered performance method
      for change in changes
        @_triggerListeners(id, change)
    else #FALLBACK
      #If we don't know what's changed, just look through the things we are watching (if any) and trigger those
      #If they've changed
      id = newObj.id
      oldObj = @objs[id]

      props = EventRegistry.getWatchedProperties(@getName(), id);

      for prop in props
        if _.get(oldObj, prop) != _.get(newObj, prop)
          @_triggerListeners(id, prop)

    @add(newObj)

  _triggerListeners: (objId=null, property=null) ->
    @triggerListeners(@getName(), objId, property)

  _registerWatcher: (watcherId, id, prop) ->
    EventRegistry.register(watcherId, @getName(), id, prop)

  _registerList: (name, validator) ->
    @_lists[name] = new List(name, validator)

  _updateLists: (newObj) ->
    for list in @_lists
      if @_lists.updateListObj(newObj)
        @_triggerListeners(@_list.name)

module.exports = BaseComponent
