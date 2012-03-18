require('validation/validatable_field');

ET.TextField = ET.ValidatableField.extend({

  fieldViewClass: Ember.TextField.extend({
    valueObserver: (function(s, k, v) {
      return this.getPath('parentView.validator').validate(v);
    }).observes('value'),

    focusOut: function() {
      return this.setPath('parentView.hasHadFocus', true);
    }
  })
});