import { realtimeDB, firestore } from "./database";
import * as cors from "cors";
import * as express from "express";
import * as path from "path";
//import { nanoid } from "nanoid";

const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");

//const usersCollection = firestore.collection("users");
//const gameroomsCollectionRef = firestore.collection("gamerooms");

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
