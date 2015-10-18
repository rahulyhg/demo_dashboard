'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'ngMdIcons',
  'myApp.dashboard',
  'myApp.services',
  'myApp.directives',
  'chart.js'
])
.constant('ENDPOINT_API', '../../api/')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/dashboard'});
}]);
