import { realtimeDB, firestore } from "./database";
import * as cors from "cors";
import * as express from "express";
import * as path from "path";
import { nanoid } from "nanoid";

const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");

const usersCollectionRef = firestore.collection("users");
const gameroomsCollectionRef = firestore.collection("gamerooms");

const port = process.env.PORT || 3000;

//API INIT AND CONFIG
const app = express();
app.use(express.json());
app.use(cors());

// ENDPOINTS
app.get("/env", (req, res) => {
  res.json({
    environment: "hola",
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
            new: true,
          });
        });
      } else {
        // SI EL EMAIL YA ESTABA REGRISTRADO EN UN USER, DEVUELVE EL ID DEL USUARIO CORRESPONDIENTE
        res.status(400).json({
          message:
            "El nombre que ingresaste ya corresponde a un jugador registrado.",
        });
      }
    });
});

// CREA UN NUEVO GAMEROOM
app.post("/gamerooms", (req, res) => {
  const userId = req.body.userId;
  const ownerName = req.body.ownerName;
  usersCollectionRef
    .doc(userId.toString())
    .get()
    .then((doc) => {
      // VERIFICA QUE EL USUARIO EXISTA EN FIRESTORE USANDO EL ID
      // DE SER ASÍ, CREA UNA NUEVA ROOM CON UN ID
      if (doc.exists) {
        // CREAMOS LA REFERENCIA DEL NUEVO ROOM
        const newRoomRef = realtimeDB.ref("gamerooms/" + nanoid(10));
        // STEAMOS EL OWNER COMO EL USER QUE INGRESO EL BODY
        newRoomRef
          .set({
            owner: ownerName,
            ownerId: userId,
          })
          .then(() => {
            // GUARDA EL ID LARGO Y CREA UN ID CORTO PARA GUARDAR EN FIRESTORE
            const roomLongId = newRoomRef.key;
            const randonNumber = 1000 + Math.floor(Math.random() * 999);
            const roomId = "GR" + randonNumber.toString();

            // CREA UN NUEVO DOCUMENTO EN LA COLLECTION ROOMS DE FIRESTORE CON EL ID LARGO DENTRO
            gameroomsCollectionRef
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              // DEVUELVE EL ID CORTO
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        // SI NO EXISTE, DEVUELVE UN ERROR 401
        res.status(401).json({
          message: "El id del usuario no existe.",
        });
      }
    });
});

// DEVUELVE EL LARGO VERIFICANDO EL USERID Y EL GAMEROOMID
app.get("/gamerooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  console.log(roomId);
  // REVISA SI EL USER ID CORRESPONDE A ALGUN USUARIO DE USERS EN FIRESTORE
  usersCollectionRef
    .doc(userId.toString())
    .get()
    .then((doc) => {
      // SI EXISTE, VA A BUSCAR EL ROOM ID LARGO DENTRO DE FIRESTORE, USANDO EL ID CORTO
      if (doc.exists) {
        gameroomsCollectionRef
          .doc(roomId)
          .get()
          .then((snap) => {
            // VERIFICA QUE EL ROOM EXISTA
            if (snap.exists) {
              // TERMINA DEVOLVIENDO EL ID LARGO QUE CORRESPONDE AL ROOM
              const data = snap.data();
              res.json(data);
            } else {
              // SI NO EXISTE, DEVUELVE UN ERROR 401
              res.status(401).json({
                message: "El Gameroom indicado no existe.",
              });
            }
          });
      } else {
        // SI NO EXISTE, DEVUELVE UN ERROR 401
        res.status(401).json({
          message: "El id del usuario no existe.",
        });
      }
    });
});

// TRAE LA DATA DEL GAMEROOM
app.post("/gamerooms/:id", function (req, res) {
  const chatRoomRef = realtimeDB.ref("/gamerooms/" + req.params.id);
  chatRoomRef.on("value", (snap) => {
    let value = snap.val();
  });
  chatRoomRef.push(req.body, function () {
    res.json("todo ok");
  });
});

// AUTHENTICATION
app.post("/auth", (req, res) => {
  var userName = req.body.name;
  usersCollectionRef
  .where("name", "==", userName)
  .get()
  .then((searchResponse) => {
    // VERIFICA QUE EL EMAIL DEL USER EXISTA EN ALGUN DOC
    if (searchResponse.empty) {
      res.status(404).json({
        message:
        "El nombre que ingresaste no corresponde a un usuario registrado.",
      });
    } else {
      //DEVUELVE EL ID DEL USER IDENTIFICADO
      res.status(200).json({
        id: searchResponse.docs[0].id,
      });
    }
  });
});

// EXPRESS STATIC
app.use(express.static("dist"));

// RETURN TO INDEX.HTML
app.get("*", (req, res) => {
  res.sendFile(`${rutaRelativa}`);
});

//API LISTEN
app.listen(port, () => {
  console.log(`Estamos conectados al puerto: ${port}`);
});
