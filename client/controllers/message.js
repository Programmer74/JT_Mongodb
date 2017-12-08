var myApp = angular.module('myApp');

myApp.controller('MessageController', [ '$scope', '$http', '$location', '$routeParams', '$routeParams',
    function($scope, $http, $location, $routeParams){
        console.log('>> MessageController loaded');

        $scope.getMessage = function () {
            $http.get('/api/message').then(function(response){
                var data = response.data;
                $scope.message = data;
                console.log(data);
            }).catch(function() {
                alert("Get messages failed");
            });
        };

        $scope.removeMessage = function (id) {
            $http.delete('/api/message/' + id).then(function(response) {
                //refresh();
                console.log('Message deleted');
                window.location.href="#!message";
            }).catch (function (){
                console.log('Error while deleting');
                alert("Delete message failed");
            })
        };

        $scope.addMessage = function() {
            console.log($scope.message);
            $http.post('/api/message', $scope.msg).then(function(response) {
                console.log(response);
                window.location.href="#!message";
            }).catch(function() {
                alert("Add message failed");
            });
        };

        $scope.updateMessage = function(id) {
            $http.put('/api/message/' + id, $scope.msg).then(function (response) {
                console.log(response);
                window.location.href="#!message";
            }).catch(function() {
                alert("Update message failed");
            });
        };

        $scope.deselect = function() {
            $scope.msg = "";
        }

    }]);