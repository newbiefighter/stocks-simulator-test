'use strict';


var app = angular.module('app', ['ngRoute', 'btford.socket-io']);

app.config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/stock', {
        templateUrl: '/modules/stock/stock.html',
        controller: 'stockController'
      })
      .otherwise({
        redirectTo: '/stock'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

  }
]);

app.factory('socket', function(socketFactory) {
  return socketFactory();
})