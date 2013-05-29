/*
 *  ElementReflectionController.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Way to expose $element in a scope to interface better with UI-bootstrap
 *  TODO: This is a bunch of garbage, ui-bootstrap is a disease, should get
 *  off it at some point
 *
 */

function ElementReflectionController($scope, $element) {
  $scope.$element = $element;
}