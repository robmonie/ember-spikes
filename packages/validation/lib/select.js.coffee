require('validation/validatable_field')

ET.SelectField = ET.ValidatableField.extend

  fieldViewClass: Ember.Select.extend

    contentBinding:           'parentView.content'
    selectionBinding:         'parentView.selection'
    optionLabelPathBinding:   Ember.Binding.oneWay 'parentView.optionLabelPath'
    optionValuePathBinding:   Ember.Binding.oneWay 'parentView.optionValuePath'
    promptBinding:            Ember.Binding.oneWay 'parentView.prompt'

    selectionObserver: ((s,k,v) ->
      @getPath('parentView.validator').validate(v)
    ).observes('selection')

    #Fix for previously selection dependent fields that have their options updated based on selection
    #of another field
    contentObserver: (->
      @set('selection', null)
    ).observes 'content', 'content.length'

    focusOut: ->
      @setPath('parentView.hasHadFocus', true)
