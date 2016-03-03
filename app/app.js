(function() {
    'use strict';

    var holoApp = angular.module('holoApp', ['ngResource', 'ngRoute']);

    // ROUTING
    holoApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/pages/threejs.html',
                controller: 'ThreeJSController'
            })
            .when('/max_time', {
                templateUrl: 'app/pages/max_time/max_time.html',
                controller: 'MaxTimeController'
            })
            .when('/rest', {
                templateUrl: 'app/pages/rest/rest.html',
                controller: 'RESTController'
            })
            .when('/threejs', {
                templateUrl: 'app/pages/threejs/threejs.html',
                controller: 'ThreeJSController'
            })
            .otherwise({ redirectTo: '/'});
    });


    // CONTROLLERS
    holoApp.controller('NavController', ['$scope', '$location', function($scope, $location) {
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
    }]);

})();