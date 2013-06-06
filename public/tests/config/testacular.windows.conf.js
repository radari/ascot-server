basePath = '../../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
  'https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js',
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.3/angular.js',
  'vendor/angular/angular-*.js',
  'tests/lib/angular-mocks.js',
  'common/basic_tools.js',
  'javascripts/controllers/TaggerViewController.js',
  'javascripts/controllers/MainSearchBarController.js',
  'javascripts/controllers/SettingsController.js',
  'javascripts/controllers/LooksListController.js',
  'javascripts/controllers/CollectionController.js',
  'javascripts/services/Autocomplete.js',
  'tests/*.js'
];

autoWatch = true;

browsers = ['IE'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
