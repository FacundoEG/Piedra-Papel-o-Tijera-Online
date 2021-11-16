"use strict";
exports.__esModule = true;
var database_1 = require("./database");
var cors = require("cors");
var express = require("express");
var path = require("path");
var nanoid_1 = require("nanoid");
var rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");
var usersCollectionRef = database_1.firestore.collection("users");
var gameroomsCollectionRef = database_1.firestore.collection("gamerooms");
var port = process.env.PORT || 3000;
//API INIT AND CONFIG
var app = express();
app.use(express.json());
app.use(cors());
// ENDPOINTS
app.get("/env", function (req, res) {
    res.json({
        environment: "hola"
    });
});
// SIGNUP
app.post("/signup", function (req, res) {
    var userName = req.body.name;
    usersCollectionRef
        .where("name", "==", userName)
        .get()
        .then(function (searchResponse) {
        // VERIFICA QUE NO HAYA UN DOC CON EL EMAIL IGUAL AL USER EMAIL
        if (searchResponse.empty) {
            usersCollectionRef.add({ name: userName }).then(function (newUserRef) {
                // DEVUELVE UN OBJETO CON EL ID DEL NUEVO USUSARIO CORRESPONDIENTE
                res.status(200).json({
                    id: newUserRef.id,
                    "new": true
                });
            });
        }
        else {
            // SI EL EMAIL YA ESTABA REGRISTRADO EN UN USER, DEVUELVE EL ID DEL USUARIO CORRESPONDIENTE
            res.status(400).json({
                message: "El nombre que ingresaste ya corresponde a un jugador registrado."
            });
        }
    });
});
// CREA UN NUEVO GAMEROOM
app.post("/gamerooms", function (req, res) {
    var userId = req.body.userId;
    var ownerName = req.body.ownerName;
    usersCollectionRef
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        // VERIFICA QUE EL USUARIO EXISTA EN FIRESTORE USANDO EL ID
        // DE SER ASÍ, CREA UNA NUEVA ROOM CON UN ID
        if (doc.exists) {
            // CREAMOS LA REFERENCIA DEL NUEVO ROOM
            var newRoomRef_1 = database_1.realtimeDB.ref("gamerooms/" + (0, nanoid_1.nanoid)(10));
            // STEAMOS EL OWNER COMO EL USER QUE INGRESO EL BODY
            newRoomRef_1
                .set({
                currentgame: {
                    player1: {
                        choice: "undefined",
                        online: false,
                        start: false,
                        playerName: "none",
                        playerScore: 0
                    },
                    player2: {
                        choice: "undefined",
                        online: false,
                        start: false,
                        playerName: "none",
                        playerScore: 0
                    }
                },
                owner: ownerName,
                ownerId: userId
            })
                .then(function () {
                // GUARDA EL ID LARGO Y CREA UN ID CORTO PARA GUARDAR EN FIRESTORE
                var roomLongId = newRoomRef_1.key;
                var randonNumber = 1000 + Math.floor(Math.random() * 999);
                var roomId = "GR" + randonNumber.toString();
                // CREA UN NUEVO DOCUMENTO EN LA COLLECTION ROOMS DE FIRESTORE CON EL ID LARGO DENTRO
                gameroomsCollectionRef
                    .doc(roomId.toString())
                    .set({
                    rtdbRoomId: roomLongId
                })
                    // DEVUELVE EL ID CORTO
                    .then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            // SI NO EXISTE, DEVUELVE UN ERROR 401
            res.status(401).json({
                message: "El id del usuario no existe."
            });
        }
    });
});
// DEVUELVE EL LARGO VERIFICANDO EL USERID Y EL GAMEROOMID
app.get("/gamerooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    console.log(roomId);
    // REVISA SI EL USER ID CORRESPONDE A ALGUN USUARIO DE USERS EN FIRESTORE
    usersCollectionRef
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        // SI EXISTE, VA A BUSCAR EL ROOM ID LARGO DENTRO DE FIRESTORE, USANDO EL ID CORTO
        if (doc.exists) {
            gameroomsCollectionRef
                .doc(roomId)
                .get()
                .then(function (snap) {
                // VERIFICA QUE EL ROOM EXISTA
                if (snap.exists) {
                    // TERMINA DEVOLVIENDO EL ID LARGO QUE CORRESPONDE AL ROOM
                    var data = snap.data();
                    res.json(data);
                }
                else {
                    // SI NO EXISTE, DEVUELVE UN ERROR 401
                    res.status(401).json({
                        message: "El Gameroom indicado no existe."
                    });
                }
            });
        }
        else {
            // SI NO EXISTE, DEVUELVE UN ERROR 401
            res.status(401).json({
                message: "El id del usuario no existe."
            });
        }
    });
});
// AUTHENTICATION
app.post("/auth", function (req, res) {
    var userName = req.body.name;
    usersCollectionRef
        .where("name", "==", userName)
        .get()
        .then(function (searchResponse) {
        // VERIFICA QUE EL EMAIL DEL USER EXISTA EN ALGUN DOC
        if (searchResponse.empty) {
            res.status(404).json({
                message: "El nombre que ingresaste no corresponde a un usuario registrado."
            });
        }
        else {
            //DEVUELVE EL ID DEL USER IDENTIFICADO
            res.status(200).json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
// CONNECTA A LOS JUGADORES AL GAMEROOM
app.post("/gamedata/:id", function (req, res) {
    var player = req.query.player;
    var playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, function () {
        res.status(201).json({ message: player + "Conectado" });
    });
});
// CONNECTA A LOS JUGADORES AL GAMEROOM
app.post("/gamestart/:id", function (req, res) {
    var player = req.query.player;
    var playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, function () {
        res.status(201).json({ message: player + "listo para jugar" });
    });
});
// EXPRESS STATIC
app.use(express.static("dist"));
// RETURN TO INDEX.HTML
app.get("*", function (req, res) {
    res.sendFile("" + rutaRelativa);
});
//API LISTEN
app.listen(port, function () {
    console.log("Estamos conectados al puerto: " + port);
});
