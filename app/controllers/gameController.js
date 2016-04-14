app
    .controller('gameController', ['$scope', '$cookies', '$interval', '$timeout', 'gameFactory', 'gameListFactory', function($scope, $cookies, $interval, $timeout, gameFactory, gameListFactory) {
        $scope.colonnes = [{}, {}, {}, {}, {}, {}, {}];
        $scope.nomPlayer = $cookies.get('name');
        $scope.tokenPlayer = $cookies.get('idPlayer');
        $scope.idGame = $cookies.get('idGame');
        $scope.advName = "???";
        $scope.board = [[0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0]];
        $scope.state = "...";
        $scope.playerScore = ($cookies.get('playerScore')) ? $cookies.get('playerScore') : 0;
        $scope.advScore = ($cookies.get('advScore')) ? $cookies.get('advScore') : 0;
        $scope.endGame = false;
        $scope.replayGame = "";
        $scope.waitingFor = "";
        $scope.chrono = {heures: 0,minutes: 0, secondes: 0};
        $scope.chronoPlayer = {heures: 0,minutes: 0, secondes: 0};
        $scope.showWin = [];
        var timerRun = false,
            stopTimer,
            stopTimerPlayer,
            stopNotif;

        function infosGame() { // on récupère les données du tableau de jeu
            var yLength,xLength, y,x;
            gameFactory
                .getGameData($scope.nomPlayer, $scope.tokenPlayer, $scope.idGame)
                .then(function(response){
                    $scope.animOk = "";
                    var gameData = response.data;
                    $scope.tempBoard = gameData.Lines;
                    $scope.$watch('tempBoard', function (newValue, oldValue) {
                        if (!angular.equals(newValue, oldValue)) { // on regarde si des changements sont survenus dans le tableau de jeu
                            yLength = $scope.tempBoard.length;
                            xLength = $scope.tempBoard[0].length;
                            for (y = 0; y < yLength; y++) {
                                for (x = 0; x < xLength; x++) {
                                    if (newValue[y][x] != oldValue[y][x]) { // on cherche où sont les changements
                                        $scope.animOk = "L" + y + "C" + x;
                                    }
                                }
                            }
                        }
                    });
                    $scope.board = $scope.tempBoard.reverse(); // on met à jour la grille de jeu
                });
        }

        function showResultGame(state) { // on affiche le résultat d'une partie finie
            var tabResult;
            if (!$scope.endGame) {
                if (state === "Draw") { // si la partie est nulle
                    swal({
                        title: "Match Nul !!!",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonColor: "#859CA1",
                        confirmButtonText: "Ok!",
                        closeOnConfirm: true,
                        animation: "slide-from-top"
                    });
                } else {
                    tabResult = state.split(" ");
                    if (tabResult[2] === $scope.nomPlayer) { // si on a gagné
                        swal({
                            title: "You Win !!!",
                            type: "success",
                            imageUrl: "./images/winGif.gif",
                            imageSize: "300x300",
                            showCancelButton: false,
                            confirmButtonColor: "#51C468",
                            confirmButtonText: "Ok!",
                            closeOnConfirm: true,
                            animation: "slide-from-top"
                        },
                            function () {
                                $scope.showWin = gameFactory.combinaisonGagnante($scope.board);
                                $scope.playerScore++; // on incrémente notre score
                                $cookies.put('playerScore', $scope.playerScore); // on stocke notre score dans les cookies
                                gameFactory.pushMessage($scope.nomPlayer, $scope.tokenPlayer, $scope.idGame, "score:" + $scope.playerScore); // on envoie notre score à l'adversaire pour qu'il s'affiche de son côté
                            }
                        );
                    } else { // si on a perdu
                        swal({
                            title: "Looser !!!",
                            type: "error",
                            imageUrl: "./images/looseHulaHoop.gif",
                            imageSize: "300x300",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Ok!",
                            closeOnConfirm: true,
                            animation: "slide-from-bottom"
                        },
                            function () {
                                $scope.showWin = gameFactory.combinaisonGagnante($scope.board);
                            }
                        );
                    }
                }
                $scope.endGame = true; // affiche le bouton rejouer
            }
        }

        function determinePlayer(namePlayer1, namePlayer2) { // on determine qui est le joueur 1 et qui est son adversaire
            if ($scope.nomPlayer == namePlayer1) {
                if (namePlayer2) {
                    $scope.advName = namePlayer2;
                } else {
                    $scope.advName = "???";
                }
            } else {
                if (namePlayer1) {
                    $scope.advName = namePlayer1;
                } else {
                    $scope.advName = "???";
                }
            }
        }

        function startTimer(chrono, global) {
            if(global){
                timerRun = true;
            }

            return $interval(function() {
                if(chrono.secondes < 59) {
                    chrono.secondes += 1;
                } else {
                    chrono.secondes = 0;
                    if(chrono.minutes < 59) {
                        chrono.minutes += 1;
                    } else {
                        chrono.minutes = 0;
                        if(chrono.heures < 23) {
                            chrono.heures += 1;
                        } else {
                            chrono.heures = 0;
                        }
                    }
                }
            }, 1000);
        }

        function synopsis() {
            var objRep,playerOne,playerTwo;
            gameFactory
                .getGameSynopsis($scope.nomPlayer, $scope.tokenPlayer, $scope.idGame)
                .then(function (response) {
                    objRep = response.data;
                    $scope.state = objRep.State;
                    playerOne = objRep.PlayerOne;
                    playerTwo = objRep.PlayerTwo;
                    determinePlayer(playerOne, playerTwo); // on determine qui est le joueur 1 et qui est son adversaire
                    if ($scope.state != "Game in progress" && $scope.state != "Waiting For Player") {
                        showResultGame($scope.state); // si la partie est finie on affiche le résultat (gagnant/perdant)
                        $interval.cancel(stopTimer); // puis on arrête le timer general
                        $interval.cancel(stopTimerPlayer); // et le timer de chaque joueur
                        if ($scope.advName == "???") { // si notre adversaire quitte la partie alors qu'elle est finie on quitte la partie et on est redirigé vers la liste des parties
                            $timeout($scope.quitterPartie, 10000);
                        }
                    } else if ($scope.state == "Game in progress" && !timerRun) {
                        stopTimer = startTimer($scope.chrono, true); // si la partie est en cours et qu'il n'est pas déjà démarré, on démarre le timer global
                    }
                });
        }

        function notification() { // on récupère les notifications concernant un joueur et une partie
            var turnPlayer,leave;
            gameFactory
                .getNotification($scope.nomPlayer, $scope.tokenPlayer, $scope.idGame)
                .then(function (response) {
                    $scope.notifications = response.data;
                    var objRep = response.data;
                    if(objRep.length) {
                        turnPlayer = objRep[0].PlayerName;
                        leave = objRep[0].PlayerLeave;
                        if (turnPlayer !== $scope.nomPlayer && !leave) { // si c'est notre tour
                            stopTimerPlayer = startTimer($scope.chronoPlayer, false); // on démarre le timer nous concernant
                        } else if (leave) {
                            $interval.cancel(stopTimer); // on arrête le timer si l'un des joueurs quitte la partie
                        }
                        if (objRep[0].Message) { // si les notifications retournent un message
                            var message = objRep[0].Message.split(":");
                            if (message[0] == "score") { // s'il s'agit d'un message concernant le score
                                $scope.advScore = message[1]; // on récupère le score de l'adversaire
                                $cookies.put('advScore', $scope.advScore); // on stocke le score de l'adversaire dans les cookies
                            } else if (message[0] == "replay") { // s'il s'agit d'un message informant que l'adversaire souhaite rejouer une partie
                                $scope.replayGame = message[1];
                                $scope.idNewGame = message[2];
                            }
                        }
                    }
                    synopsis(); // on récupère le synopsis
                    infosGame(); // on récupère les données du tableau de jeu
                });
        }

        function startNotif() {
            stopNotif = $interval(notification, 1500);
        }

        $scope.jouerPiece = function (position) { // on joue un coup
            var noMoreNotif;
            noMoreNotif = $interval.cancel(stopNotif); // on stop les notifications pour avoir l'animation du jeton qui tombe entierement
            gameFactory
                .play($scope.nomPlayer, $scope.tokenPlayer, $scope.idGame, position)
                .then(function () {
                    if(noMoreNotif) {
                        synopsis(); // on récupère le synopsis
                        infosGame(); // on récupère les données du tableau de jeu
                        $interval.cancel(stopTimerPlayer); // on arrête le timer nous concernant quand on a joué
                        $timeout(startNotif, 1000); // on relance les notifications
                    }
                });
        };

        $scope.quitterPartie = function () { // on quitte une partie
            gameFactory
                .leaveGame($scope.nomPlayer, $scope.tokenPlayer, $scope.idGame)
                .then(function () {
                    $interval.cancel(stopNotif); // on stop l'appel aux notifications
                    gameFactory.returnToListGame(); // on est redirigé vers la liste des parties
                });
        };

        function hideReplay() {
            $scope.endGame = false; // on vire le bouton rejouer
        }

        $scope.rejouerPartie = function() {
            var idGame;
            $scope.chrono = {heures: 0,minutes: 0, secondes: 0};
            $scope.chronoPlayer = {heures: 0,minutes: 0, secondes: 0}; // on remet les timer à zéro
            $scope.showWin = []; // on vire le marquage qui sert à repérer la combinaison gagnante
            timerRun = false; // permet de relancer le timer général
            if(!$scope.replayGame){ // si notre adversaire n'a pas encore cliqué sur rejouer
                gameListFactory
                    .createGame($scope.nomPlayer, $scope.tokenPlayer) // on crée une autre partie
                    .then(function(response){
                        idGame = response.data;
                        gameFactory
                            .pushMessage($scope.nomPlayer, $scope.tokenPlayer, $scope.idGame, "replay:Votre adversaire souhaite rejouer une partie:" + idGame) // on envoie une notification à notre adversaire
                            .then(function(){
                                gameListFactory
                                    .joinGame($scope.nomPlayer, $scope.tokenPlayer, idGame) // on rejoint la partie nouvellement crée
                                    .then(function(){
                                        $cookies.remove('idGame');
                                        $cookies.put('idGame', idGame); // on stocke le nouvel id de partie
                                        $scope.idGame = idGame; // on met à jour l'id de la partie
                                        synopsis(); // on récupère le synopsis
                                        infosGame(); // on récupère les données du tableau de jeu
                                        $timeout(hideReplay, 1000); // on appelle la fonction qui vire le bouton rejouer
                                    });
                            });
                    });
            } else if($scope.idNewGame){ // si notre adversaire a déjà cliqué sur rejouer
                gameListFactory
                    .joinGame($scope.nomPlayer, $scope.tokenPlayer, $scope.idNewGame) // on rejoint la partie nouvellement crée
                    .then(function(){
                        $cookies.remove('idGame');
                        $cookies.put('idGame', $scope.idNewGame); // on stocke le nouvel id de partie
                        $scope.idGame = $scope.idNewGame; // on met à jour l'id de la partie
                        $scope.replayGame = ""; // on vire le message "Votre adversaire souhaite rejouer une partie"
                        synopsis(); // on récupère le synopsis
                        infosGame(); // on récupère les données du tableau de jeu
                        $timeout(hideReplay, 1000); // on appelle la fonction qui vire le bouton rejouer
                    });
            }
        };

        synopsis();
        infosGame();
        startNotif();
    }]);