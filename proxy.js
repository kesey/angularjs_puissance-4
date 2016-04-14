var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    unirest = require('unirest'),
    app = express();

const IIS_SERVICE = "http://pc0112/ConnectFour/ConnectFourService.svc";
//const IIS_SERVICE = "http://localhost:30123/rest";

app
    .use(morgan('combined'))
    //.use(express.static(__dirname))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(function(req, res, next) { // authorise les requetes cross origin venant de http://localhost:63342
        res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
        next();
    })

    .get('/LogOn/:name',function(req, res){ // route demand�e par l'application client pour se logger
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/LogOn?name=" + params.name) // route vers l'API REST pour se logger
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
            });
    })

    .get('/GetGameList/:name/:token',function(req, res){ // route demand�e par l'application client pour avoir la liste des parties
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/GetGameList?name=" + params.name + "&token=" + params.token) // route vers l'API REST pour avoir la liste des parties
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
            });
    })

    .get('/CreateGame/:name/:token',function(req, res){ // route demand�e par l'application client pour cr�er une nouvelle partie
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/CreateGame?name=" + params.name + "&token=" + params.token) // route vers l'API REST pour cr�er une nouvelle partie
            .header('Accept', 'application/json')
            .end(function(response){
                var idGame = JSON.stringify(response.body);
                res.send(idGame);
            });
    })

    .get('/JoinGame/:name/:token/:idGame',function(req, res){ // route demand�e par l'application client pour rejoindre une partie
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/JoinGame?name=" + params.name + "&token=" + params.token + "&gameId=" + params.idGame) // route vers l'API REST pour rejoindre une partie
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
            });
    })

    .get('/GetGameData/:name/:token/:idGame',function(req, res){ // route demand�e par l'application client pour avoir la grille de jeux
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/GetGameData?name=" + params.name + "&token=" + params.token + "&gameId=" + params.idGame) // route vers l'API REST pour avoir la grille de jeux
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
                //console.log(response.body);
            });
    })

    .get('/GetGameSynopsis/:name/:token/:idGame',function(req, res){ // route demand�e par l'application client pour avoir le synopsis de la partie
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/GetGameSynopsis?name=" + params.name + "&token=" + params.token + "&gameId=" + params.idGame) // route vers l'API REST pour avoir le synopsis de la partie
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
            });
    })

    .get('/GetNotification/:name/:token/:idGame',function(req, res){ // route demand�e par l'application client pour avoir les notifications
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/GetNotification?name=" + params.name + "&token=" + params.token + "&gameId=" + params.idGame) // route vers l'API REST pour avoir les notifications
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
            });
    })

    .get('/Play/:name/:token/:idGame/:position',function(req, res){ // route demand�e par l'application client pour jouer un pion dans une colonne
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/Play?name=" + params.name + "&token=" + params.token + "&gameId=" + params.idGame + "&position=" + params.position) // route vers l'API REST pour jouer un pion dans une colonne
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
            });
    })

    .get('/LeaveGame/:name/:token/:idGame',function(req, res){ // route demand�e par l'application client pour quitter une partie
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/LeaveGame?name=" + params.name + "&token=" + params.token + "&gameId=" + params.idGame) // route vers l'API REST pour quitter une partie
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
            });
    })

    .get('/PushMessage/:name/:token/:idGame/:message',function(req, res){ // route demand�e par l'application client pour quitter une partie
        var params = req.params;
        unirest
            .get(IIS_SERVICE + "/PushMessage?name=" + params.name + "&token=" + params.token + "&gameId=" + params.idGame + "&message=" + params.message) // route vers l'API REST pour envoyer un message � son adversaire
            .header('Accept', 'application/json')
            .end(function(response){
                res.send(response.body);
            });
    })

    .listen(3000);

console.log("Proxy is running...");

