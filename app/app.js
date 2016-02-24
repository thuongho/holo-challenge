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
            .when('/max_time', {
                templateUrl: 'app/pages/max_time.html',
                controller: 'MaxTimeController',
            })
            .when('/rest', {
                templateUrl: 'app/pages/rest.html',
                controller: 'RESTController'
            })
            //.otherwise({ redirectTo: '/'});
    });

    // SERVICES
    holoApp.factory('RESTService', ['$http', '$q', function($http, $q) {

        //$http.get('/someUrl', config).then(successCallback, errorCallback);
        var get = function() {
            var deferred = $q.defer(),
                url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/?callback=JSON_CALLBACK';

            $http.get(url).success(function(data, status, header, config) {
                console.log(data);
                deferred.resolve(data);
            }).error(function(data, status, header, config) {
                console.log(status);
                deferred.reject(status);
            });

            return deferred.promise;
        };

        var post = function(pageObject) {
            var newObject = {name: pageObject.name, value: pageObject.value};
            //var deferred = $q.defer(),
            var url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/?callback=JSON_CALLBACK';

            //$http.post('/someUrl', data, config).then(successCallback, errorCallback);
            //$http.post(url, newObject).then(function(response) {
            //    if (response.data.success) {
            //        console.log(response);
            //        deferred.resolve(true);
            //    } else {
            //        deferred.resolve(false);
            //    }
            //});
            //return deferred.promise;


            $http({
                method: 'POST',
                url: url,
                data: newObject,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log("new object created with name: " + newObject.name);
                }
            });
        };

        var put = function(pageObject) {
            var updateObject = {name: pageObject.name, value: pageObject.value};
            var url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/' + pageObject.id + '?callback=JSON_CALLBACK';

            $http.put(url + updateObject)
                .success(function(data, status, headers) {
                    console.log(data + " updated.");
                })
                .error(function(data, status, header, config) {
                    console.log(status);
                });
        };

        var remove = function() {

        };

        return {
            get: get,
            post: post,
            put: put,
            delete: remove
        };
    }]);

    // CONTROLLERS
    holoApp.controller('MaxTimeController', ['$scope', function($scope) {
        $scope.title = "Max Time";
        $scope.maxTime;

        $scope.getMaxTime = function() {
            if ($scope.timeArray) {
                var timeArray = $scope.timeArray;

                // convert string to array of floats
                timeArray = timeArray.replace(/[\[\]\{\}]/g, '').replace(/time:/g, '');
                timeArray = timeArray.split(', ');
                timeArray.map(function (num) { num = parseFloat(num); });

                $scope.maxTime = Math.max.apply(null, timeArray);
            }
        };
    }]);

    holoApp.controller('RESTController', ['$scope', 'RESTService', function($scope, RESTService) {

        // GET
        $scope.loadGetData = function() {
            // show all items
            $scope.showAllItemsContainer = true;

            RESTService.get().then(function(data) {
                $scope.allItems = true;
                $scope.sampleObjects = data;
            });
        };

        // toggle show hide button
        $scope.toggleShowHide = function() {
          $scope.allItems = $scope.allItems === false ? true : false;
          $scope.hideShowButtonName = $scope.allItems === false ? 'Show All Items' : 'Hide All Items';
        };

        // POST
        $scope.object = {};

        $scope.postObject = function() {
            console.log('object: ' + JSON.stringify($scope.object));
            RESTService.post($scope.object);
        };

        // PUT
        $scope.populateField = function(item) {
            $scope.allItems = false;
            $scope.hideShowButtonName = 'Show All Items';
            $scope.showEdit = true;
            $scope.name = item.name;
            $scope.value = item.value;
            $scope.id = item.id;
        };

        // DELETE
        $scope.items = [1,2,3,4];
    }]);
})();