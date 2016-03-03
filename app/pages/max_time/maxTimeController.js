(function () {
    'use strict';

    angular.module('holoApp').controller('MaxTimeController', ['$scope', function ($scope) {
        $scope.title = "Max Time";
        $scope.maxTime;

        $scope.getMaxTime = function () {
            if ($scope.timeArray) {
                var timeArray = $scope.timeArray;

                // convert string to array of floats
                timeArray = timeArray.replace(/[\[\]\{\}]/g, '').replace(/time:/g, '');
                timeArray = timeArray.split(', ');
                timeArray.map(function (num) {
                    num = parseFloat(num);
                });

                $scope.maxTime = Math.max.apply(null, timeArray);
            }
        };
    }]);
})();