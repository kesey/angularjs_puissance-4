app
    .factory("gameListFactory", ['$http','PROXY','$window', function($http, PROXY, $window){
        var gameListFactory = {};
        gameListFactory.getGameList = function(nomPlayer,token){
            return $http.get(PROXY.url + "/GetGameList/" + nomPlayer + "/" + token); // on attaque le proxy avec la route qui sert à récupérer la liste des parties
        };
        gameListFactory.createGame = function(nomPlayer,token){
            return $http.get(PROXY.url + "/CreateGame/" + nomPlayer + "/" + token); // on attaque le proxy avec la route qui sert à créer une nouvelle partie
        };
        gameListFactory.authentification = function(){
            var url = $window.location.origin + $window.location.pathname + "#/logIn";
            $window.location.href = url; // redirection vers logIn.html
        };
        gameListFactory.goToGame = function(){
            var url = $window.location.origin + $window.location.pathname + "#/game";
            $window.location.href = url; // redirection vers game.html
        };
        gameListFactory.joinGame = function(nomPlayer,token,idGame){
            return $http.get(PROXY.url + "/JoinGame/" + nomPlayer + "/" + token + "/" + idGame); // on attaque le proxy avec la route qui sert à rejoindre une partie
        };
        return gameListFactory;
    }]);