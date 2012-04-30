ET.ValidationGroup = Ember.Mixin.create({

  isValidationGroup: true,

  init: function() {
    this._super();
    return this._validity = {};
  },

  notifyValidity: function(validatable, validity) {
    if (this._validity[validatable] !== validity) {
      this._validity[validatable] = validity;
      return this.set('lastUpdated', new Date());
    }
  },

  unregister: function(validatable) {
    return delete this._validity[validatable];
  },

  isValid: (function() {
    var k, valid = true, validity;
    valid = true;
    validity = this._validity;

    for (k in validity) {
      if (!validity[k]) {
        valid = false;
        break;
      }
    }
    return valid;
  }).property('lastUpdated').cacheable()

});