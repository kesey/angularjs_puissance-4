app
    .factory("gameFactory", ['$http','PROXY','$window', function($http, PROXY, $window){
        var gameFactory = {};
        gameFactory.getGameData = function(nomPlayer, tokenPlayer, idGame){
            return $http.get(PROXY.url + "/GetGameData/" + nomPlayer + "/" + tokenPlayer + "/" + idGame) // on attaque le proxy avec la route qui sert à récupérer les données de jeux
        };
        gameFactory.returnToListGame = function(){
            var url = $window.location.origin + $window.location.pathname + "#/listGames";
            $window.location.href = url; // redirection vers listGames.html
        };
        gameFactory.getGameSynopsis = function(nomPlayer, tokenPlayer, idGame){
            return $http.get(PROXY.url + "/GetGameSynopsis/" + nomPlayer + "/" + tokenPlayer + "/" + idGame) // on attaque le proxy avec la route qui sert à récupérer le synopsis de la partie
        };
        gameFactory.getNotification = function(nomPlayer, tokenPlayer, idGame){
            return $http.get(PROXY.url + "/GetNotification/" + nomPlayer + "/" + tokenPlayer + "/" + idGame) // on attaque le proxy avec la route qui sert à récupérer les notifications de la partie
        };
        gameFactory.play = function(nomPlayer, tokenPlayer, idGame, position){
            return $http.get(PROXY.url + "/Play/" + nomPlayer + "/" + tokenPlayer + "/" + idGame + "/" + position) // on attaque le proxy avec la route qui sert jouer
        };
        gameFactory.leaveGame = function(nomPlayer, tokenPlayer, idGame){
            return $http.get(PROXY.url + "/LeaveGame/" + nomPlayer + "/" + tokenPlayer + "/" + idGame) // on attaque le proxy avec la route qui sert à quitter une partie
        };
        gameFactory.pushMessage = function(nomPlayer, tokenPlayer, idGame, message){
            return $http.get(PROXY.url + "/PushMessage/" + nomPlayer + "/" + tokenPlayer + "/" + idGame + "/" + message) // on attaque le proxy avec la route qui sert à envoyer un message à son adversaire
        };
        gameFactory.combinaisonGagnante = function(board){
            var tabCoord = [],
                showWin = [],
                x, y, i, winCoordY, winCoordX;

            function verif(coordX, coordY, direction) {
                var verifCoord = [],
                    i;
                verifCoord.push({ligne: coordY, colonne: coordX});
                for (i = 0; i < 3; i++) {
                    if (board[coordY + direction.moveY + (i * direction.moveY)][coordX + direction.moveX + (i * direction.moveX)] === board[coordY][coordX]) {
                        verifCoord.push({ligne: coordY + direction.moveY + (i * direction.moveY), colonne: coordX + direction.moveX + (i * direction.moveX)});
                    } else {
                        verifCoord = [];
                        return verifCoord;
                    }
                }
                return verifCoord;
            }

            for (y = 6 - 1; y >= 0; y--) { // on parcours le tableau à la recherche d'une combinaison gagnante
                for (x = 0; x < 7; x++) {
                    if (board[y][x] != 0) { // si un pion est présent à ces coordonnées
                        if (x <= 3) {
                            tabCoord = verif(x, y, {moveY: 0, moveX: 1}); // verif ligne
                        }
                        if (tabCoord.length < 4 && y >= 3) {
                            tabCoord = verif(x, y, {moveY: -1, moveX: 0}); // verif colonne
                        }
                        if (tabCoord.length < 4 && x <= 3 && y >= 3) {
                            tabCoord = verif(x, y, {moveY: -1, moveX: 1}); // verif diagonale haute
                        }
                        if (tabCoord.length < 4 && x <= 3 && y <= 2) {
                            tabCoord = verif(x, y, {moveY: 1, moveX: 1}); // verif diagonale basse
                        }
                        if (tabCoord.length >= 4) {
                            for (i = 0; i < 4; i++) {
                                winCoordY = tabCoord[i].ligne;
                                winCoordX = tabCoord[i].colonne;
                                showWin[i] = "L" + winCoordY + "C" + winCoordX;
                            }
                            return showWin;
                        }
                    }
                }
            }

        };
        return gameFactory;
    }]);