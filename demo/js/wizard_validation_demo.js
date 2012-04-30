// Ember.ENV.RAISE_ON_DEPRECATION = true;
window.Demo = Ember.Application.create({
  NAMESPACE: 'Demo',
  VERSION:   '0.1.0',
  main: function() {
    Demo.WizardFormView.create({
      classNames: ['form-horizontal']
    }).appendTo("#app-root");
  }
});

DETAILS_TEMPLATE = '\
<fieldset>\
<legend>Personal Details</legend>\
{{view ET.TextField label="Name" required="true" valueBinding="content.name"}}\
{{view ET.TextField label="Email" required="true" valueBinding="content.email" validators="email"}}\
{{view ET.TextField label="Phone" required="true" valueBinding="content.phone" validators="minLength(8) maxLength(12)"}}\
{{view ET.TextField label="Age" required="true" valueBinding="content.age" validators="numberRange(1..100)"}}\
{{view GenderSelect}}\
</fieldset>\
'

ADDRESS_TEMPLATE = '\
<fieldset>\
<legend>Address</legend>\
{{view ET.TextField label="Street Address" required="true" valueBinding="content.streetAddress"}}\
{{view ET.TextField label="City/Suburb" required="true" valueBinding="content.suburb"}}\
{{view ET.TextField label="Postcode" required="true" valueBinding="content.postcode" validators="maxLength(4)"}}\
{{view ET.TextField label="State" required="true" valueBinding="content.state"}}\
{{view ET.TextField label="Country" required="true" valueBinding="content.country"}}\
</fieldset>\
'


Demo.contactController = Ember.Object.create({
  name: null,
  streetAddress: null
});

Demo.PersonalDetailsView = ET.WizardPageView.extend({
  contentBinding: 'Demo.contactController',
  template: Ember.Handlebars.compile(DETAILS_TEMPLATE),
  GenderSelect: ET.SelectField.extend({
    label: "Gender",
    content: ['Male', 'Female'],
    selectionBinding: 'content.gender',
    optionLabelPath:  'content',
    optionValuePath:  'content',
    prompt: "Select Gender",
    required: true
  })
});

Demo.AddressView = ET.WizardPageView.extend({
  contentBinding: 'Demo.contactController',
  template: Ember.Handlebars.compile(ADDRESS_TEMPLATE)
});

Demo.ConfirmationView = ET.WizardPageView.extend({
  template: Ember.Handlebars.compile("<h2>Thanks</h2>")
});


Demo.WizardFormView = ET.WizardView.extend({

  pageViewClasses: [Demo.PersonalDetailsView, Demo.AddressView, Demo.ConfirmationView],
  lastPageIsConfirmation: true

});


$(function() {
  Demo.main();
});

