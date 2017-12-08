var myApp = angular.module('myApp');

myApp.controller('DocumentController', [ '$scope', '$http', '$location', '$routeParams', '$routeParams',
    function($scope, $http, $location, $routeParams){
        console.log('>> DocumentController loaded');

        $scope.getDocument = function () {
            $http.get('/api/document').then(function(response){
                var data = response.data;
                $scope.document = data;
                console.log(data);
            }).catch(function() {
                alert("Get documents failed");
            });
        };

        $scope.removeDocument = function (id) {
            $http.delete('/api/document/' + id).then(function(response) {
                //refresh();
                console.log('Document deleted');
                window.location.href="#!document";
            }).catch (function (){
                console.log('Error while deleting');
                alert("Delete document failed");
            })
        };

        $scope.addDocument = function() {
            console.log($scope.document);
            $http.post('/api/document', $scope.doc).then(function(response) {
                console.log(response);
                window.location.href="#!document";
            }).catch(function() {
                alert("Add document failed");
            });
        };

        $scope.updateDocument = function(id) {
            $http.put('/api/document/' + id, $scope.doc).then(function (response) {
                console.log(response);
                window.location.href="#!document";
            }).catch(function() {
                alert("Update document failed");
            });
        };

        $scope.deselect = function() {
            $scope.prf = "";
        }

    }]);