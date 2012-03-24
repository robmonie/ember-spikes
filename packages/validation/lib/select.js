require('validation/validatable_field');

ET.SelectField = ET.ValidatableField.extend({
  fieldViewClass: Ember.Select.extend({

    contentBinding: 'parentView.content',
    selectionBinding: 'parentView.selection',
    optionLabelPathBinding: Ember.Binding.oneWay('parentView.optionLabelPath'),
    optionValuePathBinding: Ember.Binding.oneWay('parentView.optionValuePath'),
    promptBinding: Ember.Binding.oneWay('parentView.prompt'),

    selectionObserver: (function(s, k, v) {
      return this.getPath('parentView.validator').validate(v);
    }).observes('selection'),

    contentObserver: (function() {
      return this.set('selection', null);
    }).observes('content', 'content.length'),

    focusOut: function() {
      return this.setPath('parentView.hasHadFocus', true);
    }
  })
});