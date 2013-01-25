'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Ascot Project', function() {
  describe('Basic home page', function() {
    beforeEach(function() {
      browser().navigateTo('/');
    });

    it('should have search results', function() {
      input('#main_search').enter('bullshit');
      expect(repeater('.autocomplete div').count()).toBe(1);
    });
  })
});