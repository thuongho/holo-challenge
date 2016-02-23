describe('maxTimeController', function() {

    beforeEach(angular.mock.module('holoApp'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    describe('getMaxTime', function() {
        it('should return the highest time', function() {
            var $scope = {};
            var controller = $controller('MaxTimeController', { $scope: $scope });

            $scope.timeArray = [{time:200}, {time:410}, {time:1000}, {time:1000.5}];

            expect($scope.maxTime).toBe(1000.5);
        });
    });

});