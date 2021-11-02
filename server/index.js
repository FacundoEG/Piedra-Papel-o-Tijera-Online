"use strict";
exports.__esModule = true;
var cors = require("cors");
var express = require("express");
var path = require("path");
//import { nanoid } from "nanoid";
var rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");
//const usersCollection = firestore.collection("users");
//const gameroomsCollectionRef = firestore.collection("gamerooms");
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
