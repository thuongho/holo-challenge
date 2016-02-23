'use strict';

describe('MaxTimeController', function() {

    var _controller,
        _scope = {};

    beforeEach(function() {
        angular.mock.module('holoApp');
        angular.mock.inject(function($controller) {
            _controller = $controller;
        });
    });


    describe('getMaxTime', function() {
        it('should return the highest time', function() {
            _controller = _controller('MaxTimeController', { $scope: _scope });

            _scope.timeArray = '[{time:200}, {time:410}, {time:1000}, {time:1000.5}]';
            _scope.getMaxTime();
            expect(_scope.maxTime).toBe(1000.5);
        });
    });

});