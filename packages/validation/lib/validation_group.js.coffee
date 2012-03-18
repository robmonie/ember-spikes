ET.ValidationGroup = Ember.Object.extend

  init: ->
    @_super()
    @_validity = {}

  notifyValidity: (validatable, validity) ->
    if @_validity[validatable] != validity
      @_validity[validatable] = validity
      @set('lastUpdated', new Date())

  unregister: (validatable) ->
    delete @_validity[validatable]

  isValid: (->
    valid = true
    for k, v of @_validity
      if not v
        valid = false
        break
    valid
  ).property('lastUpdated').cacheable()