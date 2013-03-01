/*
 *  TaggerViewController.js
 *
 *  Created on: December 5, 2012
 *      Author: Valeri Karpov
 *
 *  Front-end controller for adding / deleting tags on an image
 *
 */

function TaggerViewController($scope, $http, ImageOffsetService, $redirect, $autocomplete) {
  this.$scope = $scope;

  $scope.idsToLooks = {};
  $scope.idsToEditTag = {};
  $scope.idsToDraggingTag = {};

  $scope.autocomplete = $autocomplete;
  $scope.autocomplete.setUrl('BRAND', '/brands.json');
  $scope.autocomplete.setUrl('NAME', '/names.json');

  // Initial load of look
  $scope.loadLook = function(id) {
    $scope.idsToLooks[id] = { _id : id, tags : [] };
    $http.get('/tags.jsonp?id=' + encodeURIComponent(id)).success(
        function(result) {
          $scope.idsToLooks[id] = result.look;
          $scope.idsToEditTag[id] = null;
          $scope.idsToDraggingTag[id] = null;
        });
  };

  $scope.computeTagDisplayPosition = function(id, tag) {
    var position;
    var displayHeight = ImageOffsetService.getHeight(id);
    var displayWidth = ImageOffsetService.getWidth(id);
    
    if ($scope.idsToLooks[id].size.height == displayHeight &&
        $scope.idsToLooks[id].size.width == displayWidth) {
      position = {
          x : tag.position.x,
          y : tag.position.y
      };
    } else {
      position = {
          x : (tag.position.x / $scope.idsToLooks[id].size.width) * displayWidth,
          y : (tag.position.y / $scope.idsToLooks[id].size.height) * displayHeight
      };
    }
    
    return position;
  };

  $scope.computeEditTagOverlayDisplayPosition = function(id) {
    if (!$scope.idsToEditTag[id]) {
      return {};
    }

    var position = $scope.computeTagDisplayPosition(id, $scope.idsToEditTag[id]);
    var displayHeight = ImageOffsetService.getHeight(id);
    var displayWidth = ImageOffsetService.getWidth(id);

    if (position.x <= displayWidth / 2.0 &&
        position.y <= displayHeight / 2.0) {
      return { left : (position.x + 25) + 'px', top : (position.y + 25) + 'px' };
    } else if (position.x <= displayWidth / 2.0 &&
        position.y > displayHeight / 2.0) {
      return { left : (position.x + 25) + 'px', bottom : ((displayHeight - position.y)) + 'px' };
    } else if (position.x > displayWidth / 2.0 &&
        position.y <= displayHeight / 2.0) {
      return { right : ((displayWidth - position.x)) + 'px', top : (position.y + 25) + 'px' };
    } else {
      return { right : ((displayWidth - position.x)) + 'px', bottom : ((displayHeight - position.y)) + 'px' };
    }
  };
  
  $scope.computePositionFromDisplay = function(id, pageX, pageY) {
    var offset = ImageOffsetService.getOffset(id);
    
    var position;
    var displayHeight = ImageOffsetService.getHeight(id);
    var displayWidth = ImageOffsetService.getWidth(id);
    if ($scope.idsToLooks[id].size.height == displayHeight &&
        $scope.idsToLooks[id].size.width == displayWidth) {
      position = {
          x : (pageX - offset.x),
          y : (pageY - offset.y)
      };
    } else {
      position = {
          x : ((pageX - offset.x) / displayWidth) * $scope.idsToLooks[id].size.width,
          y : ((pageY - offset.y) / displayHeight) * $scope.idsToLooks[id].size.height
      };
    }
    
    return position;
  };

  // Add a tag
  $scope.addTag = function(id, pageX, pageY) {
    var position = $scope.computePositionFromDisplay(id, pageX, pageY);
    if (position.x < 0) {
      position.x = 0;
    }
    if (position.y < 0) {
      position.y = 0;
    }
    
    var newTag =
        { index : $scope.idsToLooks[id].tags.length + 1,
          position : position,
          product : {
            name : "",
            brand : "",
            buyLink : "",
            price : 0
          }
        };

    $scope.idsToLooks[id].tags.push(newTag);
    $scope.startEdittingTag(id, newTag);
    return newTag;
  };

  // Start editting a tag
  $scope.startEdittingTag = function(id, tag) {
    $scope.idsToEditTag[id] = tag;
  };

  // Check if we're in editting state
  $scope.isEdittingTag = function(id) {
    return $scope.idsToEditTag[id] != null;
  };

  // Finish editting tag
  $scope.finishEdittingTag = function(id) {
    if ($scope.isEdittingTag(id)) {
      $scope.idsToEditTag[id] = null;
    }
  };

  // Delete a tag
  $scope.deleteTag = function(id, tag) {
    if ($scope.idsToEditTag[id] == tag) {
      $scope.idsToEditTag[id] = null;
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
      var position = $scope.computePositionFromDisplay(id, pageX, pageY);
      $scope.idsToDraggingTag[id].position.x = position.x;
      $scope.idsToDraggingTag[id].position.y = position.y;
    }
  }
  
  $scope.finalize = function(id, key) {
    $http.put('/tagger/' + key + '/' + id, $scope.idsToLooks[id]).success(
        function(data) {
          $redirect('/look/' + id + '?showProgress=1');
        });
  };
  $("#taggerHelp").click(function() {
  $("#taggerHelp").fadeOut(300);
  });
}


