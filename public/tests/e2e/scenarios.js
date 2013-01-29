'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Ascot Project', function() {
  describe('Basic home page', function() {
    beforeEach(function() {
      browser().navigateTo('/');
    });

    it('should handle user interaction with search bar', function() {
      input('mainSearch').enter('bullshit');
      expect(repeater('.autocomplete div').count()).toBe(1);
      element('.autocomplete div').click();
      expect(browser().location().url()).toBe('/keywords?v=bullshit');
    });
    
    it('should be able to upload an image', function() {
      element('#submitLink').val('http://www.google.com/images/srpr/logo3w.png');
      element('#submit').click();
      sleep(5);
      sleep(5);
      // Wait for 10 seconds for next page to load
      expect(browser().window().href()).toContain('/tagger/');
    });
  })
});
