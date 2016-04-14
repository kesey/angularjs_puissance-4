app
    .factory("logInFactory", ['$http','PROXY','$window', function($http, PROXY, $window){
        var logInFactory = {};
        logInFactory.logOn = function(nomPlayer){
            return $http.get(PROXY.url + "/LogOn/" + nomPlayer); // on attaque le proxy avec la route qui sert à se logger
        };
        logInFactory.returnToListGame = function(){
            var url = $window.location.origin + $window.location.pathname + "#/listGames";
            $window.location.href = url; // redirection vers listGames.html
        };
        return logInFactory;
    }]);