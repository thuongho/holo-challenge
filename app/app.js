(function() {
    'use strict'

    var holoApp = angular.module('holoApp', ['ngResource', 'ngRoute']);

    // ROUTING
    holoApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/index.html',
                controller: 'MainController',
            })
            .when('/max_time', {
                templateUrl: 'app/pages/max_time.html',
                controller: 'MaxTimeController',
            })
            .when('/rest', {
                templateUrl: 'app/pages/rest.html',
                controller: 'RESTController',
            })
            .when('/threejs', {
                templateUrl: 'app/pages/threejs.html',
                controller: 'ThreeJSController'
            });
            //.otherwise({ redirectTo: '/'});
    });

    // SERVICES
    holoApp.factory('RESTService', ['$http', '$q', function($http, $q) {

        //$http.get('/someUrl', config).then(successCallback, errorCallback);
        var get = function() {
            var deferred = $q.defer(),
                url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/?callback=JSON_CALLBACK';

            $http.get(url).success(function(data, status, header, config) {
                //console.log(data);
                deferred.resolve(data);
            }).error(function(data, status, header, config) {
                console.log(status);
                deferred.reject(status);
            });

            return deferred.promise;
        };

        var post = function(pageObject) {
            var newObject = {name: pageObject.name, value: pageObject.value};
            var deferred = $q.defer();
            var url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/?callback=JSON_CALLBACK';
            var header = {'Content-Type': 'application/x-www-form-urlencoded'};

            //$http.post('/someUrl', data, config).then(successCallback, errorCallback);
            $http.post(url, newObject, header).then(function(response) {
                if (response.data.success) {
                    console.log(response);
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            });
            return deferred.promise;
        };

        var put = function(pageObject) {
            //var updateObject = {name: pageObject.name, value: pageObject.value};
            var updateObjectName = '&name=' + pageObject.name.replace(/ /g, '%20');
            var updateObjectValue = '&value=' + pageObject.value.replace(/ /g, '%20');
            var url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/'
                        + pageObject.id
                        + '?callback=JSON_CALLBACK'
                        + updateObjectName
                        + updateObjectValue;

            console.log(url);

            $http.jsonp(url)
                .success(function(data) {
                    console.log(data + " updated.");
                })
                .error(function(data, status, header, config) {
                    console.log('data: ' + data);
                    console.log('status: ' + status);
                    console.log('header: ' + header);
                    console.log('config: ' + config);
                });
            //$http.put(url + updateObject)
            //    .success(function(data, status, headers) {
            //        console.log(data + " updated.");
            //    })
            //    .error(function(data, status, header, config) {
            //        console.log(status);
            //    });
        };

        var remove = function(objectID) {
            //delete: { method: 'DELETE', params: {id: '@id'} }
            var url = 'http://2-dot-crowdev-template.appspot.com/v1/tests/' + objectID.id + '?callback=JSON_CALLBACK';
            $http.delete(url)
                .success(function(data, status) {
                    console.log(JSON.stringify(data) + " deleted.");
                })
                .error(function(data, status) {
                    console.log(status);
                });
        };

        return {
            get: get,
            post: post,
            put: put,
            delete: remove
        };
    }]);

    // CONTROLLERS
    holoApp.controller('MainController', ['$scope', '$location', function($scope, $location) {
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
    }]);

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

    holoApp.controller('RESTController', ['$scope', '$route', 'RESTService', function($scope, $route, RESTService) {

        // GET
        $scope.loadGetData = function() {
            // show all items
            $scope.showAllItemsContainer = true;
            $scope.hideShowButtonName = 'Hide All';

            RESTService.get().then(function(data) {
                $scope.allItems = true;
                $scope.sampleObjects = data;
            });
        };

        // toggle show hide button
        $scope.toggleShowHide = function() {
            $scope.allItems = $scope.allItems === false ? true : false;
            $scope.hideShowButtonName = $scope.allItems === false ? 'Show All' : 'Hide All';
        };

        // populate EDIT field when item is clicked
        $scope.populateField = function(item) {
            $scope.updateItem = item;
            $scope.allItems = false;
            $scope.hideShowButtonName = 'Show All';
            $scope.showEdit = true;
        };

        // POST
        $scope.object = {};

        $scope.postObject = function() {
            console.log('object: ' + JSON.stringify($scope.object));
            RESTService.post($scope.object);
            $scope.showPost = false;
            $route.reload();
        };

        // PUT
        $scope.updateEditItem = function() {
            $scope.showAllItemsContainer = false;
            //if ($scope.updateItem.name !== $scope.selectedItem.name || $scope.updateItem.value !== $scope.selectedItem.value) {}
            RESTService.put($scope.updateItem);
            $route.reload();
        };

        // DELETE
        $scope.removeItem = function(item) {
            if (confirm('Delete ' + JSON.stringify(item) + '?')) {
                RESTService.delete(item);
                $route.reload();
            }
        };

        // SORT
        $scope.sort = function(value) {
            $scope.sortType = value;
            $scope.sortName = value === 'name' ? true : false;
            $scope.sortValue = value === 'value' ? true : false;
        };

        // ORDER
        $scope.order = function(bool) {
            $scope.reverse = bool;
            $scope.orderAsc = bool === false ? true : false;
            $scope.orderDesc = bool === true ? true : false;
        };
    }]);

    holoApp.controller('ThreeJSController', ['$scope', '$window', function($scope, $window) {

        // The Set
        var scene = new THREE.Scene(),
            renderer = new THREE.WebGLRenderer(),
            light = new THREE.AmbientLight(0xffffff),
            camera,
            plane;

        // Actor / Actresses
        var geometry,
            material,
            cube,
            cubeNumber = 0,
            sphere,
            sphereNumber = 0;

        // Stats
        var stats = new Stats();

        var targetContainer = document.querySelector('#webgl-container'),
            containerWidth;

        // Controls
        var controls;

        // Grid
        var size = 10,
            step = 1;


        $scope.initScene = function() {

            // set size to render content
            containerWidth = targetContainer.clientWidth;
            renderer.setSize(containerWidth, $window.innerHeight);

            // Stats
            stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

            // align top-left
            // bootstrap col adds 15px padding to left
            // h1 h: 39, margin-top: 20, margin-bottom: 10 and dropdown h: 34
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '15px';
            stats.domElement.style.top = '105px';

            // add elements to webgl-container
            angular.element(targetContainer.appendChild(stats.domElement));
            angular.element(targetContainer.appendChild(renderer.domElement));

            // Grid
            plane = new THREE.GridHelper(size, step);
            plane.setColors(new THREE.Color(0x00FFFF), new THREE.Color(0x00CC00));
            scene.add(plane);

            // LIGHTS!
            scene.add(light);

            // CAMERA!
            camera = new THREE.PerspectiveCamera(35, containerWidth / $window.innerHeight, 1, 1000);
            camera.position.z = 25;
            scene.add(camera);

            // Controls
            controls = new THREE.OrbitControls( camera, renderer.domElement );

            // Stars of the Scene
            $scope.addCube = function() {

                cubeNumber++;

                geometry = new THREE.BoxGeometry(1,2,1);
                material = new THREE.MeshBasicMaterial({ color: 0xCCFFFF });

                cube = new THREE.Mesh(geometry, material);

                cube.name = "cube" + cubeNumber;
                cube.position.y = 1;

                scene.add(cube);
            };


            $scope.addSphere = function() {

                sphereNumber++;

                geometry = new THREE.SphereGeometry(0.2, 32, 32);
                material = new THREE.MeshBasicMaterial({ color: 0xFFFFCC });

                sphere = new THREE.Mesh(geometry, material);

                sphere.name = "sphere" + sphereNumber;
                sphere.position.y = 1;

                scene.add(sphere);
            };

            // ACTION!
            render();
        };

        function render() {
            if (sphere) {
                sphere.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(render);
            stats.update();
        }

        // for debugging
        return {
            scene: scene,
            sphere: sphere,
            cube: cube
        }
    }]);
})();