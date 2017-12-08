var myApp = angular.module('myApp');

myApp.controller('AttachmentController', [ '$scope', '$http', '$location', '$routeParams', '$routeParams',
    function($scope, $http, $location, $routeParams){
        console.log('>> AttachmentController loaded');

        $scope.getAttachment = function () {
            $http.get('/api/attachment').then(function(response){
                var data = response.data;
                $scope.attachment = data;
                console.log(data);
            }).catch(function() {
                alert("Get attachments failed");
            });
        };

        $scope.removeAttachment = function (id) {
            $http.delete('/api/attachment/' + id).then(function(response) {
                //refresh();
                console.log('Attachment deleted');
                window.location.href="#!attachment";
            }).catch (function (){
                console.log('Error while deleting');
                alert("Delete attachment failed");
            })
        };

        $scope.addAttachment = function() {
            console.log($scope.attachment);
            $http.post('/api/attachment', $scope.att).then(function(response) {
                console.log(response);
                window.location.href="#!attachment";
            }).catch(function() {
                alert("Add attachment failed");
            });
        };

        $scope.updateAttachment = function(id) {
            $http.put('/api/attachment/' + id, $scope.att).then(function (response) {
                console.log(response);
                window.location.href="#!attachment";
            }).catch(function() {
                alert("Update attachment failed");
            });
        };

        $scope.deselect = function() {
            $scope.att = "";
        }

    }]);