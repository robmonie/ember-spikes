var BASIC_FIELD_TEMPLATE, BASIC_FIELD_TEMPLATE_STRING, CONTROL_GROUP_TEMPLATE;

BASIC_FIELD_TEMPLATE_STRING = "{{view fieldViewClass}}\n{{#if hintOrErrorText}}\n  <div class=\"help-block\">{{hintOrErrorText}}</div>\n{{/if}}";
BASIC_FIELD_TEMPLATE = Ember.Handlebars.compile(BASIC_FIELD_TEMPLATE_STRING);
CONTROL_GROUP_TEMPLATE = Ember.Handlebars.compile("<label class=\"control-label\">{{label}}</label>\n<div class=\"controls\">\n  " + BASIC_FIELD_TEMPLATE_STRING + "\n</div>");

ET.ValidatableField = Ember.View.extend({
  classNameBindings: ['error', 'controlGroup'],
  label: 'Field Label',
  hint: null,
  errorMessages: null,
  controlGroup: true,
  hasHadFocus: false,

  templateBinding: Ember.Binding.oneWay('controlGroup').transform(function(controlGroup) {
    if (controlGroup) {
      return CONTROL_GROUP_TEMPLATE;
    } else {
      return BASIC_FIELD_TEMPLATE;
    }
  }),

  init: function() {
    var options;
    this._super();
    this.set('validator', ET.Validator.create({
      host: this
    }));
    // options = {};
    // if (this.get('valueBinding')) {
    //   Em.mixin(options, {
    //     valueBinding: this.get('valueBinding')
    //   });
    // }
    // this.set('FieldView', this.get('fieldViewClass').extend(options));

  },

  destroy: function() {
    this.get('validator').destroy();
    return this._super();
  },

  isValidBinding: Em.Binding.oneWay('errorMessages').transform(function(messages) {
    return (messages != null ? messages.length : void 0) > 0;
  }),

  error: (function() {
    return this.get('isValid') && this.get('hasHadFocus');
  }).property('isValid', 'hasHadFocus').cacheable(),

  hintOrErrorText: (function() {
    if (this.get('error')) {
      return this.get('errorMessages').join("<br/>");
    } else {
      return this.get('hint');
    }
  }).property('error', 'hint').cacheable(),

  errorDidChange: (function() {
    if (this.get('controlGroup')) {
      return;
    }
    if (this.get('error')) {
      return this.$().closest('.control-group').addClass('error');
    } else {
      return this.$().closest('.control-group').removeClass('error');
    }
  }).observes('error')
});