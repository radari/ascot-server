/*
 *  Autocomplete.test.js
 *
 *  Created on: February 20, 2012
 *      Author: Valeri Karpov
 *
 *  Test for autocomplete service
 *
 */

describe('Services', function() {
  beforeEach(module('AutocompleteModule'));
  
  describe('Autocomplete', function() {
    var autocomplete, $httpBackend;
  
    beforeEach(inject(function ($injector, $autocomplete) {
      autocomplete = $autocomplete;
      $httpBackend = $injector.get('$httpBackend');
    }));
    
    it('should make an HTTP callout to update results', function() {
      autocomplete.setUrl('TAG', '/test/autocomplete');
      $httpBackend.expectGET('/test/autocomplete?query=abc').
          respond(['abcd', 'abcdefg']);
      autocomplete.updateResults('TAG', 'abc');
      $httpBackend.flush();
      expect(autocomplete.results['TAG'].length).toBe(2);
      expect(autocomplete.results['TAG'][0]).toBe('abcd');
      expect(autocomplete.results['TAG'][1]).toBe('abcdefg');
      expect(autocomplete.getSelected('TAG')).toBe('abcd');
    });
  });
});
