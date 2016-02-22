(function() {
    'use strict'

    var holoApp = angular.module('holoApp', ['ngResource', 'ngRoute']);

    // ROUTING
    holoApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'pages/max_time.html',
                controller: 'maxTimeController'
            });
    });

    // SERVICES

    // CONTROLLERS
    holoApp.controller('maxTimeController', ['$scope', function($scope) {
        $scope.title = "Hello Angular";
    }]);
})();