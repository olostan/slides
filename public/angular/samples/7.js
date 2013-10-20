angular.module('myApp', [])
.config(function($routeProvider) {
    $routeProvider.
      when('/', {controller:'MainCtrl', templateUrl:'main.html'}).
      when('/view/:id', {controller:'ViewCtrl', templateUrl:'view.html'}).
      otherwise({redirectTo:'/'});
  })
.controller('MainCtrl', function($scope) {})
.controller('ViewCtrl', function($scope,$routeParams) { $scope.id = $routeParams.id;})