(function () {
    'use strict'

    angular.module('holoApp').factory('RESTService', ['$http', '$q', function ($http, $q) {

        var get = function () {
            var deferred = $q.defer(),
                url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/?callback=JSON_CALLBACK';

            $http.get(url)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (response) {
                        console.error('Error: ', response.statusText);
                        deferred.reject(response.status);
                    });

            return deferred.promise;
        };

        var post = function (pageObject) {
            var newObject = {name: pageObject.name, value: pageObject.value};
            var deferred = $q.defer();
            var url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/?callback=JSON_CALLBACK';
            var header = {'Content-Type': 'application/x-www-form-urlencoded'};

            $http.post(url, newObject, header)
                .then(function (response) {
                    if (response.data.success) {
                        console.log(response);
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }
                });

            return deferred.promise;
        };

        var put = function (pageObject) {
            //var updateObject = {name: pageObject.name, value: pageObject.value};
            var updateObjectName = '&name=' + pageObject.name.replace(/ /g, '%20');
            var updateObjectValue = '&value=' + pageObject.value.replace(/ /g, '%20');
            var url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/' + pageObject.id + '?callback=JSON_CALLBACK' + updateObjectName + updateObjectValue;

            //$http.jsonp(url)
            //    .success(function (data) {
            //        console.log(data + " updated.");
            //    })
            //    .error(function (data, status, header, config) {
            //        console.log('data: ' + data);
            //        console.log('status: ' + status);
            //        console.log('header: ' + header);
            //        console.log('config: ' + config);
            //    });
            console.log('update this ', url);

        };

        var remove = function (objectID) {
            var url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/' + objectID.id + '?callback=JSON_CALLBACK';
            $http.delete(url)
                .then(function (response) {
                    console.log(response.data.message);
                });

        };

        return {
            get: get,
            post: post,
            put: put,
            delete: remove
        };
    }]);
})();