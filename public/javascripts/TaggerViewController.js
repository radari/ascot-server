/*
 *  TaggerViewController.js
 *
 *  Created on: December 5, 2012
 *      Author: Valeri Karpov
 *
 *  Front-end controller for adding / deleting tags on an image
 *
 */

function TaggerViewController($scope, $http, ImageOffsetService, $location) {
  this.$scope = $scope;

  $scope.idsToLooks = {};
  $scope.idsToEditTag = {};
  $scope.idsToSearchQueries = {};
  $scope.idsToSearchResults = {};
  $scope.idsToDraggingTag = {};

  // Initial load of look
  $scope.loadLook = function(id) {
    $scope.idsToLooks[id] = { _id : id, tags : [] };
    $http.get('/tags.jsonp?id=' + encodeURIComponent(id)).success(
        function(look) {
          $scope.idsToLooks[id] = look;
          $scope.idsToEditTag[id] = null;
          $scope.idsToSearchQueries[id] = "";
          $scope.idsToSearchResults[id] = [];
          $scope.idsToDraggingTag[id] = null;
        });
  };

  // Add a tag
  $scope.addTag = function(id, pageX, pageY) {
    var offset = ImageOffsetService.getOffset(id);
    var newTag =
        { index : $scope.idsToLooks[id].tags.length + 1,
          position : { x : (pageX - offset.x), y : (pageY - offset.y) } };

    $scope.idsToLooks[id].tags.push(newTag);
    $scope.editTaggedProduct(id, newTag);
    return newTag;
  };

  // Start editting a tag
  $scope.editTaggedProduct = function(id, tag) {
    $scope.idsToEditTag[id] = tag;
  };

  // Check if we're in editting state
  $scope.isEdittingTag = function(id) {
    return $scope.idsToEditTag[id] != null;
  };

  // Search for products
  $scope.findProducts = function(id, search) {
    $http.get('/products.json?query=' + encodeURIComponent(search)).success(
        function(results) {
          $scope.idsToSearchResults[id] = results.data;
        });
  };

  // Finish editting tagged product
  $scope.setTaggedProduct = function(id, product) {
    if ($scope.isEdittingTag(id)) {
      $scope.idsToEditTag[id].product = product._id;
      $scope.idsToEditTag[id] = null;
      // Reset search
      $scope.idsToSearchQueries[id] = "";
      $scope.idsToSearchResults[id] = [];
    }
  };

  // Delete a tag
  $scope.deleteTag = function(id, tag) {
    if ($scope.idsToEditTag[id] == tag) {
      $scope.idsToEditTag[id] = null;
      $scope.idsToSearchQueries[id] = "";
      $scope.idsToSearchResults[id] = [];
    }
  
    var index = -1;
    for (var i = 0; i < $scope.idsToLooks[id].tags.length; ++i) {
      if ($scope.idsToLooks[id].tags[i] == tag) {
        index = i;
        break;
      }
    }
    if (index != -1) {
      $scope.idsToLooks[id].tags.remove(index);
      for (var i = 0; i < $scope.idsToLooks[id].tags.length; ++i) {
        $scope.idsToLooks[id].tags[i].index = i + 1;
      }
    }
  };

  $scope.startDraggingTag = function(id, tag) {
    $scope.idsToDraggingTag[id] = tag;
  }
  
  $scope.finishDraggingTag = function(id, tag) {
    $scope.idsToDraggingTag[id] = null;
  }

  // Update tag thats currently being editted's position
  $scope.updateDraggingTagPosition = function(id, pageX, pageY) {
    if ($scope.idsToDraggingTag[id] != null) {
      var offset = ImageOffsetService.getOffset(id);
      $scope.idsToDraggingTag[id].position.x = pageX - offset.x;
      $scope.idsToDraggingTag[id].position.y = pageY - offset.y;
    }
  }
  
  $scope.finalize = function(id, key) {
    $http.put('/tagger/' + key + '/' + id, $scope.idsToLooks[id].tags).success(
        function(data) {
          // TODO: This method isn't testable because of this jQuery call
          $(location).attr('href', '/look/' + id);
        });
  };
}
