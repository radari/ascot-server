'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Ascot Project', function() {
  describe('Ascot plugin', function() {
    beforeEach(function() {
      browser().navigateTo('/samples/no_launcher.html');
      sleep(0.8);
    });

    it('should display tags and image menu', function() {
      expect(repeater('.ascot_overlay_tag_container').count()).toBe(4);
      expect(element('.ascot_overlay_menu_wrapper:nth-child(1)').html()).not().toBe('');
      expect(element('.ascot_overlay_tag_container:nth-child(3) .ascot_overlay_tag_name').html()).toBe('1');
      expect(element('.ascot_overlay_tag_container:nth-child(4) .ascot_overlay_tag_name').html()).toBe('2');
      expect(element('.ascot_overlay_tag_container:nth-child(5) .ascot_overlay_tag_name').html()).toBe('3');
      expect(element('.ascot_overlay_tag_container:nth-child(6) .ascot_overlay_tag_name').html()).toBe('4');
    });

    it('should display tag descriptions on hover', function() {
      element('.ascot_overlay_tag_container:nth-child(3)').mouseover();
      sleep(0.5);
      expect(element('.ascot_overlay_tag_container:nth-child(3) .ascot_overlay_tag_description').css('display')).toBe('block');
      expect(element('.ascot_overlay_tag_container:nth-child(4) .ascot_overlay_tag_description').css('display')).toBe('none');
      expect(element('.ascot_overlay_tag_container:nth-child(5) .ascot_overlay_tag_description').css('display')).toBe('none');
      expect(element('.ascot_overlay_tag_container:nth-child(6) .ascot_overlay_tag_description').css('display')).toBe('none');
      
      element('.ascot_overlay_tag_container:nth-child(3)').mouseout();
      sleep(0.5);
      expect(element('.ascot_overlay_tag_container:nth-child(3) .ascot_overlay_tag_description').css('display')).toBe('none');
      expect(element('.ascot_overlay_tag_container:nth-child(4) .ascot_overlay_tag_description').css('display')).toBe('none');
      expect(element('.ascot_overlay_tag_container:nth-child(5) .ascot_overlay_tag_description').css('display')).toBe('none');
      expect(element('.ascot_overlay_tag_container:nth-child(6) .ascot_overlay_tag_description').css('display')).toBe('none');
    });
    
    it('should display share menu on share click', function() {
      element('.ascot_overlay_image_menu div:nth-child(1)').click();
      sleep(0.6);
      expect(element('.ascot_overlay_share_menu:nth-child(2)').css('display')).toBe('block');
      
      element('.ascot_overlay_image_menu div:nth-child(1)').click();
      sleep(0.6);
      expect(element('.ascot_overlay_share_menu:nth-child(2)').css('display')).toBe('none');
    });
    
    it('should display embed textarea when user clicks embed', function() {
      element('.ascot_overlay_image_menu div:nth-child(1)').click();
      sleep(0.3);
      
      element('li#ascot_overlay_share:nth-of-type(2)').click();
      sleep(0.3);
      expect(element('.ascot_overlay_share_menu:nth-child(1)').css('display')).toBe('block');
      
      element('li#ascot_overlay_share:nth-of-type(2)').click();
      sleep(0.3);
      expect(element('.ascot_overlay_share_menu:nth-child(1)').css('display')).toBe('none');
      
      element('li#ascot_overlay_share:nth-of-type(2)').click();
      element('.ascot_overlay_image_menu div:nth-child(1)').click();
      expect(element('.ascot_overlay_share_menu:nth-child(1)').css('display')).toBe('none');
    });
    
    it('should toggle heart when user clicks the upvote button', function() {
      element('.ascot_overlay_image_menu div:nth-child(2) img').click();
      sleep(0.3);
      expect(element('.ascot_overlay_image_menu div:nth-child(2) img').css('opacity')).toBe('1');
      expect(element('.ascot_overlay_image_menu div:nth-child(2) img').src()).toBe('http://localhost:3000/images/overlayOptions_heart_small_opaque.png');
      
      element('.ascot_overlay_image_menu div:nth-child(2) img').click();
      sleep(0.3);
      expect(element('.ascot_overlay_image_menu div:nth-child(2) img').css('opacity')).toBeLessThan(1);
      expect(element('.ascot_overlay_image_menu div:nth-child(2) img').src()).toBe('http://localhost:3000/images/overlayOptions_heart_small.png');
    });
  });

  describe('Tagger functionality', function() {
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
      expect(element('#buyLinkInput').val()).toBe('http://www.google.com');
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
  });
  
  describe('Login functionality', function() {
    beforeEach(function() {
      browser().navigateTo('/login');
      sleep(2);
    });
    
    it('should be able to register', function() {
      element('#username').val('vkarpov');
      element('#password').val('abc123');
      element('#pickEmail').val('val@ascotproject.com');
      element('#createAccount').click();
      
      sleep(3);
      expect(browser().window().href()).toContain('/login');
    });
    
    it('should be able to log in successfully', function() {
      element('#username').val('vkarpov');
      element('#password').val('abc123');
      element('#signIn').click();
      
      sleep(3);
      expect(browser().window().href()).toContain('/home');
    });
    
    it('should be able to see uploaded image in my looks page', function() {
      element('#username').val('vkarpov');
      element('#password').val('abc123');
      element('#signIn').click();
      
      sleep(3);
      
      browser().navigateTo('/upload');
      sleep(3);
      
      element('#submitLink').val('http://www.google.com/images/srpr/logo3w.png');
      element('#submit').click();
      sleep(5);
      // Wait for 5 seconds for next page to load
      expect(browser().window().href()).toContain('/tagger/');
      
      browser().navigateTo('/home');
      sleep(3);
      
      expect(repeater('.look_element').count()).toBe(1);
    });
    
    it('should be able to change and save settings', function() {
      element('#username').val('vkarpov');
      element('#password').val('abc123');
      element('#signIn').click();
      sleep(3);
      
      browser().navigateTo('/settings');
      sleep(3);
      
      expect(input('data.affiliates.shopsense.enabled').val()).toBe('on');
      expect(input('data.affiliates.shopsense.key').val()).toBe('uid4336-13314844-31');
      
      input('data.affiliates.shopsense.key').enter('1234');
      element('#settingsSave').click();
      sleep(2);
      
      browser().navigateTo('/');
      sleep(3);
      
      browser().navigateTo('/settings');
      sleep(3);
      
      expect(input('data.affiliates.shopsense.key').val()).toBe('1234');
      
      input('data.affiliates.shopsense.key').enter('uid4336-13314844-31');
      element('#settingsSave').click();
      sleep(2);
    });
  });
  
  /*describe('Tagger plugin', function() {
    beforeEach(function() {
      browser().navigateTo('/samples/mini_tagger_demo.html');
      sleep(2);
    });
    
    it('should successfully upload an image', function() {
      
    });
  });*/
});
