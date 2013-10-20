angular.module('myApp', [])
.controller('CtrlA', function($scope, shared) {
  $scope.shared = shared;
})
.controller('CtrlB', function($scope, shared) {
  $scope.shared = shared;
})
.value('shared', { X: 'initial' })
