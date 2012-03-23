require('wizard/page_view');

var TEMPLATE;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TEMPLATE = "{{view ContainerView}}\n\n{{#view NavBottomView}}\n<table>\n  <tr>\n    <td class=\"text-left\">\n      &nbsp;{{view PreviousButton}}\n    </td>\n    <td class=\"text-right\">\n      {{view NextButton}}{{view SubmitButton}}&nbsp;\n    </td>\n  </tr>\n</table>\n{{/view}}";
ET.WizardView = Ember.View.extend({

  template: Ember.Handlebars.compile(TEMPLATE),
  classNames: ['wizard-view'],
  currentPage: 1,
  isCurrentPageValid: false,
  lastPageIsConfirmation: true,

  pageViewClasses: [
    ET.WizardPageView.extend({
      template: Ember.Handlebars.compile("Override 'pageViewClasses' with your own wizard pages")
    })
  ],

  numberOfPagesBinding: Ember.Binding.oneWay('pageViewClasses.length'),

  init: function() {
    var ContainerView;
    ContainerView = Ember.ContainerView.extend({
      classNames: ['wizard-pages'],
      childViews: this.getPath('pageViewClasses'),

      init: function() {
        this._super();
        return this._setCurrentPage(this.getPath('parentView.currentPage'));
      },

      currentPageDidChange: (function(s, k, v) {
        return this._setCurrentPage(v);
      }).observes('parentView.currentPage'),

      _setCurrentPage: function(pageNumber) {
        return this.get('childViews').forEach(__bind(function(view, index) {
          if ((index + 1) === pageNumber) {
            view.set('isVisible', true);
            return this.setPath('parentView.isCurrentPageValid', view.getPath('validationGroup.isValid'));
          } else {
            return view.set('isVisible', false);
          }
        }, this));
      }
    });
    this.set('ContainerView', ContainerView);
    return this._super();
  },
  nextPage: function() {
    var newPageNumber;
    newPageNumber = this.get('currentPage') + 1;
    if (newPageNumber > this.get('numberOfPages')) {
      console.error('Attempting to navigate passed then last page');
    }
    return this.set('currentPage', this.get('currentPage') + 1);
  },

  previousPage: function() {
    var newPageNumber;
    newPageNumber = this.get('currentPage') - 1;
    if (newPageNumber < 1) {
      console.error('Attempting to navigate to page lower than 1');
    }
    return this.set('currentPage', newPageNumber);
  },

  submit: function() {
    console.log('Override submit() for custom submit logic');
    if (this.get('lastPageIsConfirmation')) {
      return this.nextPage();
    }
  },

  NavBottomView: Ember.View.extend({
    classNames: ['nav-bottom-view', 'form-actions', 'row'],

    NextButton: Ember.Button.extend({
      classNames: ['btn', 'btn-primary'],
      bindAttributes: 'disabled',
      template: Ember.Handlebars.compile('Next'),
      isVisible: (function() {
        var currentPage = this.getPath('parentView.parentView.currentPage'),
            numberOfPages = this.getPath('parentView.parentView.numberOfPages'),
            lastPageIsConfirmation = this.getPath('parentView.parentView.lastPageIsConfirmation');

        if(lastPageIsConfirmation) {
          return currentPage < (numberOfPages - 1);
        } else {
          return currentPage < numberOfPages;
        }
      }).property('parentView.parentView.currentPage'),
      disabledBinding: Ember.Binding.oneWay('parentView.parentView.isCurrentPageValid').not(),
      click: function() {
        return this.nearestWithProperty('currentPage').nextPage();
      }
    }),

    PreviousButton: Ember.Button.extend({
      classNames: ['btn'],
      template: Ember.Handlebars.compile('Previous'),
      isVisible: (function() {
        var currentPage = this.getPath('parentView.parentView.currentPage'),
            numberOfPages = this.getPath('parentView.parentView.numberOfPages'),
            lastPageIsConfirmation = this.getPath('parentView.parentView.lastPageIsConfirmation');

        if(lastPageIsConfirmation) {
          return currentPage > 1 && currentPage < numberOfPages;
        } else {
          return currentPage > 1 && currentPage <= numberOfPages;
        }
      }).property('parentView.parentView.currentPage'),
      click: function() {
        return this.nearestWithProperty('currentPage').previousPage();
      }
    }),

    SubmitButton: Ember.Button.extend({
      classNames: ['btn', 'btn-primary'],
      template: Ember.Handlebars.compile('Submit Booking'),
      isVisible: (function() {
        var currentPage = this.getPath('parentView.parentView.currentPage'),
            numberOfPages = this.getPath('parentView.parentView.numberOfPages'),
            lastPageIsConfirmation = this.getPath('parentView.parentView.lastPageIsConfirmation');
        if(lastPageIsConfirmation) {
          return currentPage === (numberOfPages - 1);
        } else {
          return currentPage === numberOfPages;
        }
      }).property('parentView.parentView.currentPage'),
      disabledBinding: Ember.Binding.oneWay('parentView.parentView.isCurrentPageValid').not(),
      click: function() {
        return this.nearestWithProperty('currentPage').submit();
      }
    })
  })
});