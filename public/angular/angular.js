angular.module('angularP', ['ui']).
  directive('tabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: false,
      controller: function($scope, $element) {
        var panes = $scope.panes = [];

        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        }

        this.addPane = function(pane) {
          if (panes.length == 0) $scope.select(pane);
          panes.push(pane);
        }
      },
      template:
        '<div class="tabbable">' +
          '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
          '</ul>' +
          '<div class="tab-content" ng-transclude></div>' +
        '</div>',
      replace: true
    };
  }).
  directive('pane', function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
    };
  }).
  factory('samples', ['$http','$q', function($http,$q) {
	return {
		load: function(stage) {
            var d = $q.defer();
            var loader = function(type) { return $http.get('samples/'+stage+'.'+type).then(function(resp) { return resp.data; }); };
            var html = loader('html');
            var css = loader('css');
            var js = loader('js');
            $q.all([html, css, js]).then(function(r) {
                d.resolve({html: r[0], css: r[1], js: r[2]});
            });
            return d.promise;
		},
        save: function(slide, code) {
            $http.post('$store', {slide: slide, code: code})
                .then(function(){alert('Saved slide '+slide);}, function() { alert('Error saving slide '+slide);});
        }
	}
  }]);
;

function demoCtrl($scope, $window, samples, $location) {
  $scope.code = { 
		html :$window.localStorage.getItem('sample_first.html') || "",
		js :$window.localStorage.getItem('sample_first.js') || "", 
		css :$window.localStorage.getItem('sample_first.css') || "" 
  };
  $scope.current = 'html';
  
  var nextUpdate = null;
  var update = function(code,mode) {

	var iframeDoc = angular.element('#preview iframe')[0].contentWindow.document;

        //var content = '<html><head><link rel="stylesheet" href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css"><script src="http://code.angularjs.org/angular-1.0.1.min.js"></script></head>';
      var scripts = ['angular.js'];
      var sc_txt = '';

      if (code.html.indexOf('<!-- test -->')!=-1) {

        scripts.push('jasmine.js');
        scripts.push('jasmine-html.js');
        scripts.push('angular-mocks.js');
      }
      scripts.forEach(function(s) { sc_txt+='<script src="libs/'+s+'"></script>'});


      var content = '<html><head><link rel="stylesheet" href="libs/bootstrap/css/bootstrap.css">'+sc_txt+'<script>document.write(\'<base href="\' + document.location + \'" />\');</script></head>';
	content += '<style>body { padding: 10px }\n'+code.css+'</style><body>'+code.html+'<script>'+code.js+'</script></body></html>';
	iframeDoc.open();
	iframeDoc.write(content);
	iframeDoc.close();
	nextUpdate = null;
	$window.localStorage.setItem('sample_first.'+mode, code[mode]);
	$window.localStorage.setItem('angular.content',content);
  }
  $scope.$watch('code[current]', function() {
	if (nextUpdate != null) $window.clearTimeout(nextUpdate);
	var code = $scope.code;
	var mode = $scope.current;
	nextUpdate = $window.setTimeout(function() { update(code,mode); }, 500);
  },true);
  $scope.getMime = function() {
	if ($scope.current == 'html') return 'text/html';
	if ($scope.current == 'js') return 'text/javascript';
	if ($scope.current == 'css') return 'text/css';
  }
  var saved = [5,7,9,11,13,15];
  $scope.$watch(function() { return $location.path();}, function(nv) {
     var slide = $location.path().substring(1)|0;
     if (saved.indexOf(slide)!=-1)
       samples.load(slide).then(function(code) {
           $scope.code = code;
       });


  });
  $scope.save = function() {
     var slide = $location.path().substring(1);
     samples.save(slide, $scope.code);
  }
};

