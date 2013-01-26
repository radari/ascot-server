basePath = '../../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
  'https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js',
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.3/angular.js',
  'vendor/angular/angular-*.js',
  'tests/lib/angular-mocks.js',
  'javascripts/basic_tools.js',
  'javascripts/TaggerViewController.js',
  'javascripts/MainSearchBarController.js',
  'tests/*.js'
];

autoWatch = true;

browsers = ['Chrome', 'Firefox'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
