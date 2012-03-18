require('validation/validatable_field')

ET.TextField = ET.ValidatableField.extend

  fieldViewClass: Ember.TextField.extend

    valueObserver: ((s,k,v) ->
      @getPath('parentView.validator').validate(v)
    ).observes('value')

    focusOut: ->
      @setPath('parentView.hasHadFocus', true)
