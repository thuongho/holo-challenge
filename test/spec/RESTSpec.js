'use strict';

describe('RESTService', function() {
    var _RESTService;

    beforeEach(function() {
        angular.mock.module('holoApp');
        angular.mock.inject(function(RESTService) {
            _RESTService = RESTService;
        });
    });

    it('should be registered', function() {
        expect(_RESTService).toBeDefined();
    });

    it('should include $resource methods', function() {
        expect(_RESTService.get).toBeDefined();
        expect(_RESTService.post).toBeDefined();
        expect(_RESTService.put).toBeDefined();
        expect(_RESTService.delete).toBeDefined();
    });
});

describe('RESTController', function() {

    var _controller, _RESTService, _mockBackend, _scope, _params;

    beforeEach(function() {
        angular.mock.module('holoApp');
        angular.mock.module('ngResource');
        angular.mock.inject(function($controller, $httpBackend, $location, $routeParams, RESTService) {
            _controller = $controller;
            _mockBackend = $httpBackend;
            _RESTService = RESTService;
            console.log('rs: ' + JSON.stringify(RESTService));
        });

    });

    describe('GET', function() {
        it('should return a json with all existing created objects', function() {

            _scope = {};
            _controller = _controller('RESTController', { $scope: _scope }, _RESTService);

            var sampleObject = {
                name: 'Sam',
                value: 'Master of the Universe!'
            };

            var sampleObjects = [sampleObject];

            _mockBackend.expectGET('/rest').respond(sampleObjects);

            //_scope.find();
            //console.log('scope: ' + JSON.stringify(_scope));
            _mockBackend.flush();
            //expect(_scope.rest).toEqualData(sampleObjects);
            expect(_scope.rest.length).toEqual(1);
        });
    });

    describe('POST', function() {
        it('should create a test object', function() {

            _scope = {};
            _controller = _controller('RESTController', { $scope: _scope }, _RESTService);

            var sampleObject = {
                name: 'Mysteries',
                value: 'Unseen World'
            };

            _mockBackend.expectPOST('http://localhost:63342/holobuilder/index.html#/rest', sampleObject).respond([{}]);

            _scope.add(sampleObject);
            expect(_scope.add).toBeTruthy();
        });
    });

    describe('PUT', function() {
        it('should update an existing test object', function() {

            _scope = {};
            _params = {};
            _params.id = 0;

            _mockBackend.expectGET('http://localhost:63342/holobuilder/index.html#/rest/0', {
                "Accept":"application/json, text/plain, */*"
            }).respond({id:0, name: 'Dr. Love', value: 'Readings from the heart'});

            _controller = _controller('RESTController', { $scope: _scope, $routeParams: _params}, _RESTService);
            var sampleObject = {id: 0, name: 'Dr. Love', value: 'Heartless'};

            _mockBackend.flush();

            expect(_scope.add).toBeFalsy();
            expect(_scope.rest.value).toEqual('Readings from the heart');

            _mockBackend.expectPUT('http://localhost:63342/holobuilder/index.html#/rest/0',{
                id: 0, name: 'Dr. Love', value: 'Heartless'
            }).respond({});

            _scope.put(item);

            _mockBackend.flush();

        });
    });

    describe('DELETE', function() {
        it('should delete an existing test object with specific ID', function() {

            _scope = {};
            _params = {};
            _params.id = 0;

            _mockBackend.expectGET('http://localhost:63342/holobuilder/index.html#/rest/0', {
                "Accept":"application/json, text/plain, */*"
            }).respond({id:0, name: 'Dr. Love', value: 'Readings from the heart'});

            _controller = _controller('RESTController', { $scope: _scope, $routeParams: _params}, _RESTService);

            _mockBackend.flush();

            _scope.find();
            _mockBackend.flush();

            expect(_scope.remove('http://localhost:63342/holobuilder/index.html#/rest/0', done)).toBeTruthy();
            expect(_scope.rest.length).toEqual(0);
        });
    });
});