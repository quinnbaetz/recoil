_  = require('lodash')

class EventRegistry
  #Used as a quick lookup for any watchers associated with a change
  _watchedEvents: {}
  #Used as a quick lookup for any events associated with a watcher
  _watcherToEvents: {}
  #Used as a throttling mechanism for updates
  _pendingTriggerIds: []
  #A map of watchers to their callbacks
  _binds: {}
  _triggerTimeouts: {}
  register: (watcherId, modelId, listId=null, objId=null, property=null) ->
    if watcherId?
      eventKey = [modelId, listId, objId, property, watcherId]
      @_createNestedMap(eventKey...)

      if !@_watcherToEvents[watcherId]?
        @_watcherToEvents[watcherId] = []

      @_watcherToEvents[watcherId].push(eventKey)

  bind: (watcherId, callback) ->
    @_binds[watcherId] = callback

  unbind: (watcherId) ->
    delete @_binds[watcherId]
    #TODO: can clean up any events for this watcher using _watcherToEvents

  triggerListener: (watcherId) ->
    if @_binds[watcherId]
      @_binds[watcherId]()

  sendPendingTriggers: (id, count) =>
    @triggerListener(id)
    delete @_triggerTimeouts[id]
  
  #Adds a slight delay to callbacks, so that we can dedupe 
  #Deduping is important in case there are many property changes that come in at once (albeit a tiny bit hacky)
  triggerListeners: (modelId, listId=null, objId=null, property=null) =>
    watcherIds = @_getKeys(modelId, listId, objId, property)
    for id in watcherIds
      if @_triggerTimeouts[id]
        clearTimeout(@_triggerTimeout)
      @_triggerTimeout = setTimeout(@sendPendingTriggers, 20)

  #These trigger any watchers registered to passed in properties    
  triggerPropListeners: (modelId, listId, objId, property) ->
    @triggerListeners(modelId, listId, objId, property)
  triggerObjListeners: (modelId, listId, objId) ->
    @triggerListeners(modelId, listId, objId, null)
  triggerListListeners: (modelId, listId) ->
    @triggerListeners(modelId, listId, null, null)


  getWatchedProperties: (modelId, listId, objId) ->
    idPropertyWatchers = @_getKeys(modelId, listId, objId)
    generalPropertyWatchers = @_getKeys(modelId, listId, null)
    watchedProps = idPropertyWatchers.concat(generalPropertyWatchers)
    return watchedProps
  
  #Removes all the associated 
  clearTriggers: (watcherId) ->
    if watcherId?
      if @_watcherToEvents[watcherId]
        #TODO: might be more performant to just delete the leaf node here and 
        #      prune the rest of the path later (essentially garbage collect when memory gets low)
        #      alternatively if every child only has one child we can prune the parent node
        for keys in @_watcherToEvents[watcherId]
          @_prunePath(@_watchedEvents, keys)

      delete @_watcherToEvents[watcherId]

  #removes an entire path of a tree if it's empty
  _prunePath: (tree, path) ->
    if _.isEmpty(_.get(tree, path))
      @_removeNode(tree, path)
      @_prunePath(tree, path.slice(1))

  #removes a specific node given a path into the tree
  _removeNode: (tree, path) ->
    if args.length == 1
      delete tree[path[0]]
      return
    @_prunePath(tree[path[0]], path.slice(1))

  #Drills in and gets all keys for a watcher
  _getKeys: (args...) ->
    base = @_watchedEvents
    for arg in args
      if !base[arg]
        return []

      base = base[arg]
    _.keys(base)

  #Creates a nesting if it doesn't already exist
  #(e.g. (one, two, three ) becomes {one: {two: {three: {}}})
  _createNestedMap: (args...) ->
    base = @_watchedEvents
    for arg in args
      base = base[arg] = base[arg] || {}
    return base

eventRegistry = new EventRegistry()
module.exports = eventRegistry
