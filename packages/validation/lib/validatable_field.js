var BASIC_FIELD_TEMPLATE, BASIC_FIELD_TEMPLATE_STRING, CONTROL_GROUP_TEMPLATE;

BASIC_FIELD_TEMPLATE_STRING = "{{view FieldView}}{{#if hintOrErrorText}}<div class=\"help-block\">{{hintOrErrorText}}</div>{{/if}}";
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

    this.set('validator', ET.Validator.create({
      host: this
    }));

    options = {};

    // if (this.get('valueBinding')) {
    //   var bindingPath = this.getPath('valueBinding._from');
    //   var start = 0;
    //   if(bindingPath.indexOf("bindingContext.") >= 0) {
    //     start = 15;
    //   }
    //   console.log(bindingPath.substr(start, bindingPath.length));
    //   options.valueBinding = bindingPath.substr(start, bindingPath.length)
    // }
    // if (this.get('selectionBinding')) {
    //   Em.mixin(options, {
    //     valueBinding: this.get('selectionBinding')
    //   });
    // }
    this.set('FieldView', this.get('fieldViewClass').extend(options));

    this._super();

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
  }).property('errorMessages', 'hint').cacheable(),

  errorStateDidChange: (function() {
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

// ET.ValidatableField.reopenClass({
//   create: function(options) {
//     console.log(arguments);
//     // var fieldOptions = Em.mixin({}, options);
//     // console.log(fieldOptions);
//     // console.log(this.get('valueBinding'))
//     // if (this.get('valueBinding')) {
//     //   Em.mixin(options, {
//     //     valueBinding: this.get('valueBinding')
//     //   });
//     // }
//     // if (this.get('selectionBinding')) {
//     //   Em.mixin(options, {
//     //     valueBinding: this.get('selectionBinding')
//     //   });
//     // }
//     // options.FieldView  = this.fieldViewClass.extend(fieldOptions);

//     return this._super()

//   }
// });
