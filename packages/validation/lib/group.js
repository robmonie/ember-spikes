ET.ValidationGroup = Ember.Object.extend({
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
    var k, v, valid, _ref;
    valid = true;
    _ref = this._validity;
    for (k in _ref) {
      v = _ref[k];
      if (!v) {
        valid = false;
        break;
      }
    }
    return valid;
  }).property('lastUpdated').cacheable()
});