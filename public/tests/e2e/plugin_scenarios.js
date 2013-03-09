/*
 *  plugin_scenarios.js
 *
 *  Created on: March 8, 2013
 *      Author: Valeri Karpov
 *
 *  Automated tests for plugin using angular E2E runner. Separate from
 *  others because these tests should go much faster than regular E2E
 *  tests and we don't have proper unit tests for plugin yet
 *
 */

'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Ascot Project Javascript Plugin', function() {
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
});