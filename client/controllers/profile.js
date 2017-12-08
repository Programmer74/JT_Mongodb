var myApp = angular.module('myApp');

myApp.controller('ProfileController', [ '$scope', '$http', '$location', '$routeParams', '$routeParams',
    function($scope, $http, $location, $routeParams){
        console.log('>> ProfileController loaded');

        $scope.getProfile = function () {
            $http.get('/api/profile').then(function(response){
                var data = response.data;
                $scope.profile = data;
                console.log(data);
            }).catch(function() {
                alert("Get profiles failed");
            });
        };

        $scope.removeProfile = function (id) {
            $http.delete('/api/profile/' + id).then(function(response) {
                //refresh();
                console.log('Profile deleted');
                window.location.href="#!profile";
            }).catch (function (){
                console.log('Error while deleting');
                alert("Delete profile failed");
            })
        };

        $scope.addProfile = function() {
            console.log($scope.profile);
            $http.post('/api/profile', $scope.prf).then(function(response) {
                console.log(response);
                window.location.href="#!profile";
            }).catch(function() {
                alert("Add profile failed");
            });
        };

        $scope.updateProfile = function(id) {
            $http.put('/api/profile/' + id, $scope.prf).then(function (response) {
                console.log(response);
                window.location.href="#!profile";
            }).catch(function() {
                alert("Update profile failed");
            });
        };

        $scope.deselect = function() {
            $scope.prf = "";
        }

    }]);