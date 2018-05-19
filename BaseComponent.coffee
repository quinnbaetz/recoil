React = require 'react'
EventRegistry = require 'event_registry'

BC_ID_ITTR = 1
class BaseComponent extends React.PureComponent
  constructor: (props) ->
    super(props)
    @_event_listeners = []
    @_id = @createNewWatcher()
    @_mounted = false

  componentDidMount: ->
    #Set up any registered listeners for component
    if @_event_listeners
      for trigger in @_event_listeners
        trigger.store.bind(trigger.name, trigger.callback)
    @_mounted = true
  componentWillUnmount: ->
    #Remove registered listeners
    if @_event_listeners
      for trigger in @_event_listeners
        trigger.store.unbind(trigger.name, trigger.callback)

  getId: => @_id
  
  getNewWatcherId: => BC_ID_ITTR++

  #Registers listeners to be removed automatically and binds
  bindListener: (store, name, callback=@rerender) =>  
    @_event_listeners.push({
      store: store,
      name: name,
      callback: callback
    })
    if @_mounted
      store.bind(name, callback)      

  createNewWatcher: (callback=@render) =>
    watcher_id = @getNewWatcherId()
    @bindListener(EventRegistry, watcher_id, callback)
    return watcher_id

  _rerender: =>
    @forceUpdate()

  render: ->
    EventRegistry.clearTriggers(@getId())

module.exports = BaseComponent