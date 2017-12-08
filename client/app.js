var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
        templateUrl: 'views/home.html'
        })

        .when ('/home', {
            templateUrl: 'views/home.html'
        })

        // profile
        .when('/profile', {
            controller: 'ProfileController',
            templateUrl: 'views/profile.html'
        })

        // document
        .when('/document', {
            controller: 'DocumentController',
            templateUrl: 'views/document.html'
        })

        // picture
        .when('/picture', {
            controller: 'PictureController',
            templateUrl: 'views/picture.html'
        })

        // attachment
        .when('/attachment', {
            controller: 'AttachmentController',
            templateUrl: 'views/attachment.html'
        })

        // message
        .when('/message', {
            controller: 'MessageController',
            templateUrl: 'views/message.html'
        })

        .otherwise({
            redirectTo: '/home'
        });

}]);