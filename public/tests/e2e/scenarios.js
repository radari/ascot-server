'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Ascot Project', function() {
  describe('Basic home page', function() {
    beforeEach(function() {
      browser().navigateTo('/upload');
    });

    it('should handle user interaction with search bar', function() {
      input('mainSearch').enter('bullshit');
      expect(repeater('.autocomplete div').count()).toBe(1);
      element('.autocomplete div').click();
      sleep(3);
      expect(browser().window().path()).toBe('/keywords');
      expect(browser().window().search()).toBe('?v=bullshit');
    });
    
    it('should be able to upload an image', function() {
      element('#submitLink').val('http://www.google.com/images/srpr/logo3w.png');
      element('#submit').click();
      sleep(5);
      // Wait for 5 seconds for next page to load
      expect(browser().window().href()).toContain('/tagger/');
    });

    it('should be able to upload, tag, and view', function() {
      element('#submitLink').val('http://www.google.com/images/srpr/logo3w.png');
      element('#submit').click();
      sleep(5);

      // Create a tag
      element('.uploadedImg').click();
      sleep(1);
      expect(repeater('.item').count()).toBe(1);

      // Type in info
      input('idsToEditTag[look].product.brand').enter('Bonobos');
      input('idsToEditTag[look].product.name').enter('Tiny Prancers');
      input('idsToEditTag[look].product.buyLink').enter('www.google.com');

      // Save tag
      element('#saveTagButton').click();
      sleep(1);
      expect(repeater('.item').count()).toBe(1);
      expect(element('#overlay').css('display')).toBe('none');

      // Click tag to edit and verify data
      element('.item').click();
      sleep(1);
      expect(element('#brandInput').val()).toBe('Bonobos');
      expect(element('#nameInput').val()).toBe('Tiny Prancers');
      expect(element('#buyLinkInput').val()).toBe('www.google.com');
      element('#saveTagButton').click();

      // Save look and wait for /look to load
      element('.save_button').click();
      sleep(5);
      expect(browser().window().href()).toContain('/look/');

      // Plugin should have loaded exactly 1 tag
      expect(repeater('.ascot_overlay_tag_container').count()).toBe(1);
      expect(element('.ascot_overlay_tag_name').html()).toBe('1');
      expect(element('.ascot_overlay_tag_description').html()).toContain('Bonobos');
      expect(element('.ascot_overlay_tag_description').html()).toContain('Tiny Prancers');
    });
  })
});
