require "bundler/setup"
require "erb"
require 'rake-pipeline'


desc "Build ember-tools.js"
task :dist => :clean do
  Rake::Pipeline::Project.new("Assetfile").invoke
end

desc "Clean build artifacts from previous builds"
task :clean do
  sh "rm -rf tmp dist tests/ember-tools-tests.js"
end