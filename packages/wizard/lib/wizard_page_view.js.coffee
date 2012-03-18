ET.WizardPageView = Ember.View.extend

  isVisible: false

  init: ->
    @_super()
    @set('validationGroup', ET.ValidationGroup.create())

  isValidDidChange: ((s,k,v)->
    @setPath('parentView.parentView.isCurrentPageValid', v)
  ).observes 'validationGroup.isValid'