angular.module('myApp', [])
.controller('Ctrl', function($scope) {
  $scope.item1 = {text: 'this is item1'};
  $scope.item2 = {text: 'this is item2'};
})
.directive('coolEditor', function() {
  return {
    restrict: 'E',
    scope: { item:'=edit'},
    template: 'Editing <input ng-model="item.text">'
  }
});
