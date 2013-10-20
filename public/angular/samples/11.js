// app.js

angular.module('myApp', [])
.controller('CtrlA', function($scope, shared) {
  $scope.shared = shared;
})
.controller('CtrlB', function($scope, shared) {
  $scope.shared = shared;
})
.value('shared', { X: 'initial' })

// appSpec.js
var jasmineEnv = jasmine.getEnv();

jasmineEnv.describe('Testing a controller', function() {
  var $scope, ctrl;

  var mocked = angular.module('myApp.mocked', ['myApp']);
  
  mocked.value('shared', { X: 'mocked' });
  
  //you need to indicate your module in a test
  jasmineEnv.beforeEach(module('myApp.mocked'));
  jasmineEnv.beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    ctrl = $controller('CtrlA', {
      $scope: $scope
    });
  }));

  jasmineEnv.it('should have mocked shared object', function() {
    expect($scope.shared.X).toEqual('mocked');
  });
});


// KICK OFF JASMINE

var trivialReporter = new jasmine.TrivialReporter();

jasmineEnv.addReporter(trivialReporter);

jasmineEnv.specFilter = function(spec) {
  return trivialReporter.specFilter(spec);
};

jasmineEnv.execute();