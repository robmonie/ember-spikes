require('validation/validatable_field');

ET.TextField = ET.ValidatableField.extend({

  fieldViewClass: Ember.TextField.extend({

    // valueBinding: Ember.Binding.oneWay('parentView.value'),
    valueObserver: (function(s, k, v) {
      this.getPath('parentView.validator').validate(v);
    }).observes('value'),

    focusOut: function() {
      this.setPath('parentView.hasHadFocus', true);
      this.getPath('parentView.validator').validate(this.get('value'));
    }

  })
});