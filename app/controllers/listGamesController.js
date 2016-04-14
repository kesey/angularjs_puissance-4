app
    .controller('listGamesController', ['$scope','$cookies','$interval','gameListFactory', function($scope, $cookies, $interval, gameListFactory){
        $scope.nomPlayer = $cookies.get('name');
        $scope.tokenPlayer = $cookies.get('idPlayer');
        $scope.statutList = "recherche de parties...";
        $scope.gameList = [];
        var stopGetGameList,
            idGame;

        function getInfos(){ // fonction servant à récupérer la liste des parties
            gameListFactory
                .getGameList($scope.nomPlayer,$scope.tokenPlayer)
                .then(function(response){
                    if(response.data != ""){
                        $scope.gameList = response.data;
                        $scope.statutList = "";
                    } else {
                        $scope.statutList = "Aucune partie disponible";
                    }
                });
        };

        $scope.newGame = function(){ // fonction servant à créer une nouvelle partie
            gameListFactory
                .createGame($scope.nomPlayer,$scope.tokenPlayer)
                .then(function(response){
                    idGame = response.data;
                    $scope.playGame(idGame);
                });
        };

        $scope.returnToLog = function(){ // fonction servant à retourner sur la page d'authentification
            $interval.cancel(stopGetGameList); // on stop l'appel à getInfos
            gameListFactory.authentification(); // redirection vers logIn.html
        };

        $scope.playGame = function(idGame){ // fonction servant à rejoindre une partie
            gameListFactory
                .joinGame($scope.nomPlayer,$scope.tokenPlayer,idGame)
                .then(function(){
                    $interval.cancel(stopGetGameList); // on stop l'appel à getInfos
                    $cookies.remove('idGame');
                    $cookies.put('idGame', idGame);
                    gameListFactory.goToGame(); // redirection vers game.html
                });
        };

        stopGetGameList = $interval(getInfos, 3000);
    }]);
