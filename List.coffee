_ = require('lodash')
class List
  constructor: (name, validator) ->
    @name = name
    @_validator = validator
    @_list = {}

  #returns true if update happened
  updateListObj: (obj) ->
    if @_validator(obj)
      if !@_list[obj.id]?
        @_list[obj.id] = true #TOOD: should we store object here... I think just ID
        return true
    else
      if @_list[obj.id]?
        delete @_list[obj.id]
        return true

    return false

  getList: () ->
    return _.keys(@_list)
    
module.exports = List