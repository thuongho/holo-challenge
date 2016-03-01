(function() {
    'use strict'

    var holoApp = angular.module('holoApp', ['ngResource', 'ngRoute']);

    // ROUTING
    holoApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                //templateUrl: 'app/index.html',
                templateUrl: 'app/pages/threejs.html',
                controller: 'ThreeJSController'
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
    holoApp.controller('NavController', ['$scope', '$location', function($scope, $location) {
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

        // The Setup
        var sceneContainer, stats;
        var light, camera, controls, scene, renderer;
        var grid, plane,
            size = 1000,
            step = 10;
        var geometry, material, y, object,
            objects = [],
            objectNumber = 0;

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2(),
            offset = new THREE.Vector3(),
            INTERSECTED, SELECTED;

        $scope.initScene = function() {

            // Ready the Set!
            sceneContainer = document.querySelector('#webgl-container');

            // CAMERA!
            camera = new THREE.PerspectiveCamera(70, sceneContainer.clientWidth / $window.innerHeight, 1, 10000);
            //camera = new THREE.PerspectiveCamera(70, $window.innerWidth / $window.innerHeight, 1, 10000);
            camera.position.z = 1000;
            camera.position.y = 500;
            //scene.add(camera);

            // Controls
            //controls = new THREE.TrackballControls( camera, renderer.domElement );
            controls = new THREE.TrackballControls( camera );
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = false;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;

            scene = new THREE.Scene();

            // LIGHTS!
            scene.add( new THREE.AmbientLight(0x505050));
            light = new THREE.SpotLight(0xffffff, 1.5);
            light.position.set(0, 500, 2000);
            light.castShadow = true;
            light.shadow.camera.near = 200;
            light.shadow.camera.far = camera.far;
            light.shadow.camera.fov = 50;
            light.shadow.bias = -0.00022;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
            scene.add(light);

            // Stars of the Scene
            //for ( var i = 0; i < 5; i ++ ) {
            //
            //    var object = new THREE.Mesh( new THREE.BoxGeometry( 20, 20, 20 ), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
            //    object.position.x = Math.random() * 100 - 50;
            //    object.position.y = 10;
            //
            //    object.castShadow = true;
            //    object.receiveShadow = true;
            //
            //    scene.add( object );
            //
            //    objects.push( object );
            //}
            $scope.addCube = function() {
                objectNumber++;
                y = randomNumberBetween(50,100);

                geometry = new THREE.BoxGeometry(
                    randomNumberBetween(50,100),
                    y,
                    randomNumberBetween(50,100)
                );
                //material = new THREE.MeshBasicMaterial({ color: 0xCCFFFF });
                material = new THREE.MeshLambertMaterial({ color: 0xCCFFFF });

                object = new THREE.Mesh(geometry, material);
                object.name = "cube" + objectNumber;
                object.position.y = y / 2;
                object.castShadow = true;
                object.receiveShadow = true;

                scene.add(object);
                objects.push(object);
            };

            $scope.addSphere = function() {
                objectNumber++;

                geometry = new THREE.SphereGeometry(20, 32, 32);
                //material = new THREE.MeshBasicMaterial({ color: 0xFFFFCC });
                material = new THREE.MeshLambertMaterial({
                    color: '#cdd971',
                    emissive: 0xFFFFCC,
                    combine: THREE.MultiplyOperation,
                    vertexColors: THREE.NoColors,
                    wireframe: true
                });

                object = new THREE.Mesh(geometry, material);
                object.name = "sphere" + objectNumber;
                object.position.x = randomNumberBetween(-size, size);
                object.position.y = 15;
                object.position.z = randomNumberBetween(-size, size);

                scene.add(object);
                objects.push(object);
            };

            // Plane
            plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
                new THREE.MeshBasicMaterial( { color: 0xFFFFCC, visible: false } )
            );
            scene.add(plane);

            // Grid
            grid = new THREE.GridHelper(size, step);
            grid.setColors(new THREE.Color(0x00FFFF), new THREE.Color(0x00CC00));
            scene.add(grid);

            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( $window.devicePixelRatio );
            renderer.setSize(sceneContainer.clientWidth, $window.innerHeight);
            renderer.sortObjects = false;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFShadowMap;
            angular.element(sceneContainer.appendChild(renderer.domElement));

            // Stats
            stats = new Stats();
            stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

            // align top-left
            // bootstrap col adds 15px padding to left
            // h1 h: 39, margin-top: 20, margin-bottom: 10 and dropdown h: 34
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '15px';
            stats.domElement.style.top = '105px';
            angular.element(sceneContainer.appendChild(stats.domElement));

            // Quiet on the Set
            sceneContainer.addEventListener('mousemove', onDocumentMouseMove, false);
            sceneContainer.addEventListener('mousedown', onDocumentMouseDown, false);
            sceneContainer.addEventListener('mouseup', onDocumentMouseUp, false);

            console.log('renderer.domElement:' + renderer.domElement);

            $window.addEventListener('resize', onWindowResize, false);

            // ACTION!
            render();
        };

        function randomNumberBetween(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // credits to draggable cubes
        function onWindowResize() {
            camera.aspect = sceneContainer.clientWidth / $window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(sceneContainer.clientWidth, $window.innerHeight);
        }

        function onDocumentMouseMove(event) {
            event.preventDefault();

            mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1.2;
            mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1.5;

            raycaster.setFromCamera(mouse, camera);
            if (SELECTED) {
                var intersects = raycaster.intersectObject(plane);

                if (intersects.length > 0) {
                    SELECTED.position.copy(intersects[0].point.sub(offset));
                }
                return;
            }

            var intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {
                if (INTERSECTED != intersects[0].object) {
                    if (INTERSECTED) { INTERSECTED.material.color.setHex(INTERSECTED.currentHex); }

                    INTERSECTED = intersects[0].object;
                    INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

                    plane.position.copy(INTERSECTED.position);
                    plane.lookAt(camera.position);
                }
                sceneContainer.style.cursor = 'pointer';
            } else {
                if (INTERSECTED) { INTERSECTED.material.color.setHex(INTERSECTED.currentHex); }
                INTERSECTED = null;
                sceneContainer.style.cursor = 'auto';
            }

        }

        function onDocumentMouseDown(event) {

            event.preventDefault();

            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {

                controls.enabled = false;
                SELECTED = intersects[0].object;

                var intersects = raycaster.intersectObject(plane);

                if (intersects.length > 0) {
                    offset.copy(intersects[0].point).sub(plane.position);
                }
                sceneContainer.style.cursor = 'move';
            }
        }

        function onDocumentMouseUp(event) {

            event.preventDefault();

            controls.enabled = true;

            if (INTERSECTED) {
                plane.position.copy(INTERSECTED.position);

                SELECTED = null;
            }
            sceneContainer.style.cursor = 'auto';
        }


        function render() {
            if (objects.length > 0) {
                objects.filter(function(object){
                    if (object.name.match(/sphere/)){
                        object.rotation.y += 0.0035;
                    }
                });

            }

            requestAnimationFrame(render);
            controls.update();
            renderer.render(scene, camera);
            stats.update();
        }

        // for debugging
        return {
            scene: scene,
            objects: objects
        }
    }]);
})();