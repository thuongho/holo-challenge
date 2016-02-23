(function() {
    'use strict'

    var holoApp = angular.module('holoApp', ['ngResource', 'ngRoute']);

    // ROUTING
    holoApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/pages/max_time.html',
                controller: 'MaxTimeController'
            })
            .otherwise({ redirectTo: '/'});
    });

    // SERVICES

    // CONTROLLERS
    holoApp.controller('MaxTimeController', ['$scope', function($scope) {
        $scope.title = "Hello Angular";
    }]);
})();