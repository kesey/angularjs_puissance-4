app
    .controller('logInController', ['$scope','$cookies','logInFactory', function($scope, $cookies, logInFactory){
        $scope.nomPlayer = ($cookies.get('name')) ? $cookies.get('name') : "";
        $scope.token = ($cookies.get('idPlayer')) ? $cookies.get('idPlayer') : "";
        $scope.alreadyLog = false;
        $scope.errLogIn = false;

        $scope.log = function(nomPlayer) { // fonction servant à se logger
            logInFactory.logOn(nomPlayer)
                        .then(function (response) {
                            if (!response.data) {
                                $scope.alreadyLog = true;
                            } else {
                                $cookies.remove('name');
                                $cookies.remove('idPlayer');
                                $cookies.put('name', nomPlayer);
                                $cookies.put('idPlayer', response.data); // on stock le nom du joueur et son id dans des cookies
                                if (!$scope.nomPlayer) $scope.nomPlayer = $cookies.get('name');
                                if (!$scope.tokenPlayer) $scope.tokenPlayer = $cookies.get('idPlayer');
                                logInFactory.returnToListGame(); // redirection vers listGames.html
                            }
                        },
                        function (response) {
                            $scope.errLogIn = "Request failed status: " + response.status; // dans ce cas là le serveur est injoignable, on affiche le message adequat dans la vue.
                        });
        };
    }]);