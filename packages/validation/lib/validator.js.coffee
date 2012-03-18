ET.Validator = Ember.Object.extend

  host: null

  init: ->
    @_super()
    host = @get('host')
    validationGroup = host.nearestWithProperty('validationGroup')?.get('validationGroup')
    if validationGroup
      @set('validationGroup', validationGroup)
      validationGroup.notifyValidity(this, false)

    @set('rules', rules = [])
    @set('required', host.get('required'))
    rules = @get('rules')

    validators = host.get('validators')
    if typeof validators == 'string'
      validators = validators.split(' ')
    else
      validators = []

    for key in validators
      validator = ET.validatorRegistry[key]
      console.error "There is no validator registered under the key '#{key}'. Double check the name in the validator registry." if not validator
      rules.pushObject(validator)

  validate: ((value)->

    errors = @get('errors')
    rules = @get('rules')
    errorMessages = []

    if @get('required')
      requiredRule = ET.validatorRegistry.required
      errorMessages.pushObject(requiredRule.message) if not requiredRule.isValid(value)

    #Only run other validators if not failing due to mandatory rules
    if not errorMessages.length
      for rule in rules
        errorMessages.pushObject(rule.message) if not rule.isValid(value)

    @get('host').set('errorMessages', errorMessages)
  )

  destroy: ->
    @get('validationGroup')?.unregister(this)
    @_super()

  notifyValidity: (->
    @get('validationGroup')?.notifyValidity(this, @getPath('host.errorMessages.length') == 0)
  ).observes('host.errorMessages')




