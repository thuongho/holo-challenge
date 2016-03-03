(function () {
    'use strict';

    angular.module('holoApp').controller('RESTController', ['$scope', '$route', 'RESTService', function ($scope, $route, RESTService) {

        // GET
        $scope.loadGetData = function () {
            // show all items
            $scope.showAllItemsContainer = true;
            $scope.hideShowButtonName = 'Hide All';
            $scope.load = true;

            RESTService.get().then(function (data) {
                if (data) {
                    $scope.load = false;
                    $scope.allItems = true;
                    $scope.sampleObjects = data;
                }
            });
        };

        // toggle show hide button
        $scope.toggleShowHide = function () {
            $scope.allItems = $scope.allItems === false;
            $scope.hideShowButtonName = $scope.allItems === false ? 'Show All' : 'Hide All';
        };

        // populate EDIT field when item is clicked
        $scope.populateField = function (item) {
            $scope.updateItem = item;
            $scope.allItems = false;
            $scope.hideShowButtonName = 'Show All';
            $scope.showEdit = true;
        };

        // POST
        $scope.object = {};

        $scope.postObject = function () {
            console.log('object: ' + JSON.stringify($scope.object));
            RESTService.post($scope.object);
            $scope.showPost = false;
            $route.reload();
        };

        // PUT
        $scope.updateEditItem = function () {
            $scope.showAllItemsContainer = false;
            //if ($scope.updateItem.name !== $scope.selectedItem.name || $scope.updateItem.value !== $scope.selectedItem.value) {}
            RESTService.put($scope.updateItem);
            $route.reload();
        };

        // DELETE
        $scope.removeItem = function (item) {
            if (confirm('Delete ' + JSON.stringify(item) + '?')) {
                RESTService.delete(item);
                $route.reload();
            }
        };

        // SORT
        $scope.sort = function (value) {
            $scope.sortType = value;
            $scope.sortName = value === 'name';
            $scope.sortValue = value === 'value';
        };

        // ORDER
        $scope.order = function (bool) {
            $scope.reverse = bool;
            $scope.orderAsc = bool === false;
            $scope.orderDesc = bool === true;
        };
    }]);
})();