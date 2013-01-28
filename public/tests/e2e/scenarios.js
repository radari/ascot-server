'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Ascot Project', function() {
  describe('Basic home page', function() {
    beforeEach(function() {
      browser().navigateTo('/');
    });

    it('Search bar should work', function() {
      input('mainSearch').enter('bullshit');
      expect(repeater('.autocomplete div').count()).toBe(1);
      element('.autocomplete div').click();
      expect(browser().location().url()).toBe('/keywords?v=bullshit');
    });
  })
});
