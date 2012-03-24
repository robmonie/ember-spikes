ET.Validator = Ember.Object.extend({
  host: null,
  init: function() {
    var host, key, rules, validationGroup, validator, validators, nearestWithValidationGroup, _i, _len, _results;
    this._super();
    host = this.get('host');
    nearestWithValidationGroup = host.nearestWithProperty('validationGroup');

    if (nearestWithValidationGroup) {
      validationGroup = nearestWithValidationGroup.get('validationGroup');
      this.set('validationGroup', validationGroup);
      validationGroup.notifyValidity(this, false);
    }

    this.set('rules', rules = []);
    this.set('required', host.get('required'));
    rules = this.get('rules');
    validators = host.get('validators');
    if (typeof validators === 'string') {
      validators = validators.split(' ');
    } else {
      validators = [];
    }
    _results = [];
    for (_i = 0, _len = validators.length; _i < _len; _i++) {
      key = validators[_i];
      validator = ET.validatorRegistry[key];
      if (!validator) {
        console.error("There is no validator registered under the key '" + key + "'. Double check the name in the validator registry.");
      }
      _results.push(rules.pushObject(validator));
    }
    return _results;
  },

  validate: (function(value) {
    var errorMessages, errors, requiredRule, rule, rules, _i, _len;
    errors = this.get('errors');
    rules = this.get('rules');
    errorMessages = [];
    if (this.get('required')) {
      requiredRule = ET.validatorRegistry.required;
      if (!requiredRule.isValid(value)) {
        errorMessages.pushObject(requiredRule.message);
      }
    }
    if (!errorMessages.length) {
      for (_i = 0, _len = rules.length; _i < _len; _i++) {
        rule = rules[_i];
        if (!rule.isValid(value)) {
          errorMessages.pushObject(rule.message);
        }
      }
    }
    return this.get('host').set('errorMessages', errorMessages);
  }),

  destroy: function() {
    var validationGroup;
    if (validationGroup = this.get('validationGroup')) {
      validationGroup.unregister(this);
    }
    return this._super();
  },

  notifyValidity: (function() {
    var validationGroup;
    if (validationGroup = this.get('validationGroup')) {
      validationGroup.notifyValidity(this, this.getPath('host.errorMessages.length') === 0);
    }
  }).observes('host.errorMessages')

});