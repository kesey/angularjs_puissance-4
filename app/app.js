var app = angular.module("puissance4", ['ngRoute', 'ngCookies']);

app
    //.constant('API_REST',{"url": "http://pc0112/ConnectFour/ConnectFourService.svc"})
    //.constant('API_REST',{"url": "http://localhost:30123/rest"})
    .constant('PROXY',{"url": "http://localhost:3000"})
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/logIn', {
                controller: 'logInController',
                templateUrl: './app/views/logIn.html'
            })
            .when('/listGames', {
                controller: 'listGamesController',
                templateUrl: './app/views/listGames.html'
            })
            .when('/game', {
                controller: 'gameController',
                templateUrl: './app/views/game.html'
            })
            .otherwise({
                redirectTo: '/logIn'
            });
    }]);