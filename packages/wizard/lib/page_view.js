ET.WizardPageView = Ember.View.extend({
  isVisible: false,
  init: function() {
    this._super();
    return this.set('validationGroup', ET.ValidationGroup.create());
  },
  isValidDidChange: (function(s, k, v) {
    return this.setPath('parentView.parentView.isCurrentPageValid', v);
  }).observes('validationGroup.isValid')
});