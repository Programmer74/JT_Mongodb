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

        .otherwise({
            redirectTo: '/home'
        });

}]);