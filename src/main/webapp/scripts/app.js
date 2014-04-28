'use strict';

angular.module('developheure',['ngRoute','ngResource'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/',{templateUrl:'views/landing.html',controller:'LandingPageController'})
      .when('/Sessions',{templateUrl:'views/Session/search.html',controller:'SearchSessionController'})
      .when('/Sessions/new',{templateUrl:'views/Session/detail.html',controller:'NewSessionController'})
      .when('/Sessions/edit/:SessionId',{templateUrl:'views/Session/detail.html',controller:'EditSessionController'})
      .otherwise({
        redirectTo: '/'
      });
  }])
  .controller('LandingPageController', function LandingPageController() {
  })
  .controller('NavController', function NavController($scope, $location) {
    $scope.matchesRoute = function(route) {
        var path = $location.path();
        return (path === ("/" + route) || path.indexOf("/" + route + "/") == 0);
    };
  });
