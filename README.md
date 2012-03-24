# Ember Tools

A few reusable ember.js components which at this stage comprises of a very alpha and incomplete validation framework and form wizard view with validation integration using the twitter bootstrap css and html format for layout.

##Getting started
TBC

##Demos
A basic demo can be found in the demo folder. This shows a three page wizard form with validation.

To run locally, clone the repository locally and build the project following the steps in 'How to build' below. The demo requires a local `dist\ember-tools.js` in order to run. Once things stabilise a bit more this step will no longer be required.

##How to build

The build tools and project structure are based largely on Ember.js for consistency and to save me the trouble of getting this setup. Thanks!

1. Install ruby 1.9.2+
2. `gem install bundler`
3. `bundle install`
4. `rake dist`

This will create a number of js files under the 'dist' folder. The easiest one to get started with is ember-tools.js. I'll document to purpose/usage of the others once i've cleaned things up.

##Developing ember-tools with Kicker

The kicker gem aids development by detecting changes to ember-tools framework files and running tasks. The most basic example of this is to run `kicker -e "rake dist"` from the packages directory to rebuild the framework as files are modified.


##To Do

* More validators
* Support for more field types
* Required field indicators
* Layout improvements
* Specs
* Performance tests for larger forms
* Docs




