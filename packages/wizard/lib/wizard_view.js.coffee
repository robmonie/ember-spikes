require('wizard/page_view')

TEMPLATE = """
  {{view ContainerView}}

  {{#view NavBottomView}}
  <table>
    <tr>
      <td class="text-left">
        &nbsp;{{view PreviousButton}}
      </td>
      <td class="text-right">
        {{view NextButton}}{{view SubmitButton}}&nbsp;
      </td>
    </tr>
  </table>
  {{/view}}
"""

ET.WizardView = Ember.View.extend

  template: Ember.Handlebars.compile(TEMPLATE)
  classNames: ['wizard-view', 'container']

  currentPage:            1

  isCurrentPageValid:     false
  lastPageIsConfirmation: true

  pageViewClasses: [
    ET.WizardPageView.extend
      template: Ember.Handlebars.compile("Override 'pageViewClasses' with your own wizard pages")
  ]

  numberOfPagesBinding: Ember.Binding.oneWay 'pageViewClasses.length'

  init: ->

    # Holds the pages of the wizard
    ContainerView = Ember.ContainerView.extend

      classNames: ['wizard-pages']

      childViews: @getPath('pageViewClasses')

      init: ->
        @_super()
        @_setCurrentPage(@getPath('parentView.currentPage'))

      currentPageDidChange: ((s,k,v) ->
        @_setCurrentPage(v)
      ).observes('parentView.currentPage')

      _setCurrentPage: (pageNumber) ->
        @get('childViews').forEach (view, index) =>
          if (index + 1) == pageNumber
            view.set('isVisible', true)
            @setPath('parentView.isCurrentPageValid', view.getPath('validationGroup.isValid'))
          else
            view.set('isVisible', false)

    @set('ContainerView', ContainerView)
    @_super()

  nextPage: ->
    newPageNumber = @get('currentPage') + 1
    console.error('Attempting to navigate passed then last page') if newPageNumber > @get('numberOfPages')
    @set('currentPage', @get('currentPage') + 1)

  previousPage: ->
    newPageNumber = @get('currentPage') - 1
    console.error('Attempting to navigate to page lower than 1') if newPageNumber < 1
    @set('currentPage', newPageNumber)

  submit: ->
    console.log('Override submit() for custom submit logic')
    @nextPage() if @get('lastPageIsConfirmation')

  NavBottomView: Ember.View.extend

    classNames: ['nav-bottom-view', 'form-actions', 'row']

    NextButton: Ember.Button.extend
      classNames: ['btn', 'btn-primary']
      bindAttributes: 'disabled'
      template: Ember.Handlebars.compile('Next')
      isVisible: (->
        @getPath('parentView.parentView.currentPage') < (@getPath('parentView.parentView.numberOfPages') - 1)
      ).property 'parentView.parentView.currentPage'
      disabledBinding: Ember.Binding.oneWay('parentView.parentView.isCurrentPageValid').not()
      click: ->
        @nearestWithProperty('currentPage').nextPage()


    PreviousButton: Ember.Button.extend
      classNames: ['btn']
      template: Ember.Handlebars.compile('Previous')
      isVisible: (->
        @getPath('parentView.parentView.currentPage') > 1
      ).property 'parentView.parentView.currentPage'

      click: ->
        @nearestWithProperty('currentPage').previousPage()

    SubmitButton: Ember.Button.extend
      classNames: ['btn', 'btn-primary']
      template: Ember.Handlebars.compile('Submit Booking')
      isVisible: (->
        @getPath('parentView.parentView.currentPage') == (@getPath('parentView.parentView.numberOfPages') - 1)
      ).property 'parentView.parentView.currentPage'
      disabledBinding: Ember.Binding.oneWay('parentView.parentView.isCurrentPageValid').not()
      click: ->
        @nearestWithProperty('currentPage').submit()