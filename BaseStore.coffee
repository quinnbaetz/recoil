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
        set: (target, prop, value) -> console.warn('Currently this is a read only object')
        get: (target, prop) => 
          value = _.get(target, prop)
          if typeof(value) == "Object"
            #TODO: build nested Proxies that build up watched attribute
            console.warn('Currently can\'t get nested objects with a watched object')
          else
            @get(target.id, prop, watcherId)

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

  #Takes a partial object and triggers any properties looking at it's listeners
  update: (newObj, changes=null) ->
    if changes?
      #Prefered performance method
      for change in changes
        EventRegistry.triggerPropListeners(@getName(), null, id, change)
    else #FALLBACK
      #If we don't know what's changed, just look through the things we are watching (if any) and trigger those 
      #If they've changed
      id = newObj.id
      oldObj = @objs[id]

      props = EventRegistry.getWatchedProperties(@getName(), null, id);

      for prop in props
        if _.get(oldObj, prop) != _.get(newObj, prop)
          EventRegistry.triggerPropListeners(@getName(), listName, id, prop);
          
    @add(newObj)
    
  _registerWatcher: (watcherId, list, id, prop) ->
    EventRegistry.register(watcherId, @getName(), list, id, prop)

  _registerList: (name, validator) ->
    @_lists[name] = new List(name, validator)

  _updateLists: (newObj) ->
    for list in @_lists
      if @_lists.updateListObj(newObj)
        EventRegistry.triggerListListeners(@getName(), @_list.name)


module.exports = BaseComponent