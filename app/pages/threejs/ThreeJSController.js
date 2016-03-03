(function () {
    'use strict';

    angular.module('holoApp').controller('ThreeJSController', ['$scope', '$window', function ($scope, $window) {

        // The Setup
        var sceneContainer, stats;
        var light, camera, controls, scene, renderer;
        var loader, model, dae;
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

        $scope.initScene = function () {

            // Ready the Set!
            sceneContainer = document.querySelector('#webgl-container');

            // CAMERA!
            camera = new THREE.PerspectiveCamera(70, sceneContainer.clientWidth / $window.innerHeight, 1, 10000);
            camera.position.z = 1000;
            camera.position.y = 500;

            // Controls
            controls = new THREE.TrackballControls(camera);
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = false;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;

            scene = new THREE.Scene();

            // LIGHTS!
            scene.add(new THREE.AmbientLight(0x505050));
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
            $scope.addCube = function () {
                objectNumber++;
                y = randomNumberBetween(50, 100);

                geometry = new THREE.BoxGeometry(
                    randomNumberBetween(50, 100),
                    y,
                    randomNumberBetween(50, 100)
                );
                material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
                //material = new THREE.MeshLambertMaterial({ color: 0xCCFFFF });

                object = new THREE.Mesh(geometry, material);
                object.name = "cube" + objectNumber;
                object.position.y = y / 2;
                object.castShadow = true;
                object.receiveShadow = true;

                scene.add(object);
                objects.push(object);
            };

            $scope.addSphere = function () {
                objectNumber++;

                geometry = new THREE.SphereGeometry(20, 32, 32);
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

            // Collada
            loader = new THREE.ColladaLoader();
            loader.options.convertUpAxis = true;

            // "Tron Lightcycle" by LiNk2.0
            // http://www.blendswap.com/blends/view/23067
            model = './models/tron-light-cycle1.dae';
            loader.load(model, function (collada) {
                dae = collada.scene;
                dae.scale.x = dae.scale.y = dae.scale.z = 5;
                dae.position.y = 1;
                dae.updateMatrix();
            });

            $scope.loadLightCycle = function () {
                scene.add(dae);
            };


            // Plane
            plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
                new THREE.MeshBasicMaterial({color: 0xFFFFCC, visible: false})
            );
            scene.add(plane);

            // Grid
            grid = new THREE.GridHelper(size, step);
            grid.setColors(new THREE.Color(0x00FFFF), new THREE.Color(0x00CC00));
            scene.add(grid);

            // Canvas
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setPixelRatio($window.devicePixelRatio);
            renderer.setSize(sceneContainer.clientWidth, $window.innerHeight);
            renderer.sortObjects = false;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFShadowMap;
            angular.element(sceneContainer.appendChild(renderer.domElement));

            // Stats
            stats = new Stats();
            stats.setMode(0); // 0: fps, 1: ms, 2: mb

            // align top-left
            // bootstrap col adds 15px padding to left
            // h1 h: 39, margin-top: 20, margin-bottom: 10 and dropdown h: 34
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '15px';
            stats.domElement.style.top = '105px';
            angular.element(sceneContainer.appendChild(stats.domElement));

            // Quiet on the Set
            sceneContainer.addEventListener('mousemove', onSceneMouseMove, false);
            sceneContainer.addEventListener('mousedown', onSceneMouseDown, false);
            sceneContainer.addEventListener('mouseup', onSceneMouseUp, false);

            // Drag and Drop source: http://www.sitepoint.com/html5-file-drag-and-drop/
            // http://jsfiddle.net/vishalvasani/4hqvu/
            if ($window.File && $window.FileList && $window.FileReader) {
                $scope.droppable = true;

                /* events fired on the drop targets */
                sceneContainer.addEventListener('dragenter', onSceneDragHover, false);
                sceneContainer.addEventListener('dragleave', onSceneDragHover, false);
                sceneContainer.addEventListener('dragover', onSceneDragOver, false);
                sceneContainer.addEventListener('drop', onSceneDrop, false);

            }

            $window.addEventListener('resize', onWindowResize, false);

            // ACTION!
            render();
        };

        function randomNumberBetween(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // credits to draggable cubes - source http://threejs.org/examples/webgl_interactive_draggablecubes.html
        function onWindowResize() {
            camera.aspect = sceneContainer.clientWidth / $window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(sceneContainer.clientWidth, $window.innerHeight);
        }

        function onSceneMouseMove(event) {
            var intersects;
            event.preventDefault();

            // stuck for hours on this, didn't realize default +/- 1 was not calibrated to object
            // accurately drag and drop area on objects
            mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1.2;
            mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1.5;

            raycaster.setFromCamera(mouse, camera);
            if (SELECTED) {
                intersects = raycaster.intersectObject(plane);

                if (intersects.length > 0) {
                    SELECTED.position.copy(intersects[0].point.sub(offset));
                }
                return;
            }

            intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {
                if (INTERSECTED != intersects[0].object) {
                    if (INTERSECTED) {
                        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                    }

                    INTERSECTED = intersects[0].object;
                    INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

                    plane.position.copy(INTERSECTED.position);
                    plane.lookAt(camera.position);
                }
                sceneContainer.style.cursor = 'pointer';
            } else {
                if (INTERSECTED) {
                    INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                }
                INTERSECTED = null;
                sceneContainer.style.cursor = 'auto';
            }

        }

        function onSceneMouseDown(event) {
            var intersects;

            event.preventDefault();

            raycaster.setFromCamera(mouse, camera);

            intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {

                controls.enabled = false;
                SELECTED = intersects[0].object;

                intersects = raycaster.intersectObject(plane);

                if (intersects.length > 0) {
                    offset.copy(intersects[0].point).sub(plane.position);
                }
                sceneContainer.style.cursor = 'move';
            }
        }

        function onSceneMouseUp(event) {

            event.preventDefault();

            controls.enabled = true;

            if (INTERSECTED) {
                plane.position.copy(INTERSECTED.position);

                SELECTED = null;
            }
            sceneContainer.style.cursor = 'auto';
        }

        // source: http://jsfiddle.net/vishalvasani/4hqvu/
        function onSceneDragHover(event) {
            // prevent default to allow drop
            event.stopPropagation();
            event.preventDefault();
            $scope.$apply(function () {
                $scope.dropClass = '';
            });

        }

        function onSceneDragOver(event) {
            event.stopPropagation();
            event.preventDefault();
            var ok = event.dataTransfer && event.dataTransfer.types && event.dataTransfer.types.indexOf('Files') >= 0;
            $scope.$apply(function () {
                // make canvas transparent
                $scope.dropClass = ok ? 'dragOver' : '';
            });

        }

        function onSceneDrop(event) {
            event.stopPropagation();
            event.preventDefault();

            $scope.$apply(function () {
                $scope.dropClass = '';
            });
            var files = event.dataTransfer.files;
            var filesDropped = [];
            //console.log('files: ', files);

            for (var i = 0; i < files.length; i++) {
                filesDropped.push(files[i]);
            }

            if (filesDropped.length > 0) {

                // Check for only DAE files
                filesDropped.filter(function (file) {
                    if (file.name.match(/\.dae$/i)) {

                        // generate a URL for the dropped file
                        var objectURL = $window.URL.createObjectURL(files[0]);

                        // use collada to add to scene
                        loader.load(objectURL, function (collada) {
                                scene.add(collada.scene);
                            },
                            function (xhr) {
                                $scope.progressBar = true;
                                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                                $scope.$apply(function () {
                                    $scope.progress = Math.round(xhr.loaded / xhr.total * 100);
                                    if ($scope.progress >= 100) {
                                        $scope.progressBar = false;
                                    }
                                })

                            });

                    } else {
                        alert('Only .dae files will render on the scene.')
                    }
                });
            }
        }


        function render() {
            // make sphere spin for cool effects
            if (objects.length > 0) {
                objects.filter(function (object) {
                    if (object.name.match(/sphere/)) {
                        object.rotation.y += 0.0035;
                    }
                });

            }

            requestAnimationFrame(render);
            controls.update();
            renderer.render(scene, camera);
            stats.update();
        }

    }]);
})();