basePath = '../../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
  'https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js',
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.3/angular.js',
  'javascripts/TaggedImage.js',
  'tests/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
