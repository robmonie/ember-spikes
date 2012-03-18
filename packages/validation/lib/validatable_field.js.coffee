
BASIC_FIELD_TEMPLATE_STRING = """
  {{view FieldView}}
  {{#if hintOrErrorText}}
    <div class="help-block">{{hintOrErrorText}}</div>
  {{/if}}
"""
BASIC_FIELD_TEMPLATE =  Ember.Handlebars.compile BASIC_FIELD_TEMPLATE_STRING

CONTROL_GROUP_TEMPLATE = Ember.Handlebars.compile """
  <label class="control-label">{{label}}</label>
  <div class="controls">
    #{BASIC_FIELD_TEMPLATE_STRING}
  </div>
"""

ET.ValidatableField = Ember.View.extend
  classNameBindings:  ['error', 'controlGroup']
  label:              'Field Label'
  hint:               null
  errorMessages:      null
  controlGroup:       true
  hasHadFocus:        false

  templateBinding:    Ember.Binding.oneWay('controlGroup').transform (controlGroup) ->
    if controlGroup then CONTROL_GROUP_TEMPLATE else BASIC_FIELD_TEMPLATE

  init: ->
    @_super()
    @set('validator', ET.Validator.create({host: this}))
    options = {}
    #This gets around some buggy shit I was seeing in the view if the binding is
    # declared via the wrapper view (weird repeating sections of html)
    if @get('valueBinding')
      Em.mixin(options, {valueBinding: @get('valueBinding')})
    @set('FieldView', @get('fieldViewClass').extend(options))

  destroy: ->
    @get('validator').destroy()
    @_super()

  isValidBinding: Em.Binding.oneWay('errorMessages').transform (messages) ->
    messages?.length > 0

  error: (->
    @get('isValid') and @get('hasHadFocus')
  ).property('isValid', 'hasHadFocus').cacheable()

  hintOrErrorText: (->
    if @get('error')
      @get('errorMessages').join("<br/>")
    else
      @get('hint')
  ).property('error', 'hint').cacheable()

  errorDidChange: (->
    return if @get('controlGroup') #Don't do if we're already a control group
    if @get('error')
      @$().closest('.control-group').addClass('error')
    else
      @$().closest('.control-group').removeClass('error')
  ).observes('error')
