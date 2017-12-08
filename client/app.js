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

        .otherwise({
            redirectTo: '/home'
        });

}]);