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
        $scope.title = "Max Time";
        $scope.maxTime;

        $scope.getMaxTime = function() {
            if ($scope.timeArray) {
                var timeArray = $scope.timeArray;
                timeArray = timeArray.replace(/[\[\]\{\}]/g, '').replace(/time:/g, '').split(', ');

                timeArray.map(function (num) {
                    num = parseFloat(num);
                });

                $scope.maxTime = Math.max.apply(null, timeArray);
            }
        };
    }]);
})();