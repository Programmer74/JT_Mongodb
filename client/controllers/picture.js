var myApp = angular.module('myApp');

myApp.controller('PictureController', [ '$scope', '$http', '$location', '$routeParams', '$routeParams',
    function($scope, $http, $location, $routeParams){
        console.log('>> PictureController loaded');

        $scope.getPicture = function () {
            $http.get('/api/picture').then(function(response){
                var data = response.data;
                $scope.picture = data;
                console.log(data);
            }).catch(function() {
                alert("Get pictures failed");
            });
        };

        $scope.removePicture = function (id) {
            $http.delete('/api/picture/' + id).then(function(response) {
                //refresh();
                console.log('Picture deleted');
                window.location.href="#!picture";
            }).catch (function (){
                console.log('Error while deleting');
                alert("Delete picture failed");
            })
        };

        $scope.addPicture = function() {
            console.log($scope.picture);
            $http.post('/api/picture', $scope.img).then(function(response) {
                console.log(response);
                window.location.href="#!picture";
            }).catch(function() {
                alert("Add picture failed");
            });
        };

        $scope.updatePicture = function(id) {
            $http.put('/api/picture/' + id, $scope.img).then(function (response) {
                console.log(response);
                window.location.href="#!picture";
            }).catch(function() {
                alert("Update picture failed");
            });
        };

        $scope.deselect = function() {
            $scope.img = "";
        }

    }]);