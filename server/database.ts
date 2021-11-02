import * as admin from "firebase-admin";
const serviceKey = require("./clave.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceKey as any),
  databaseURL: "https://dwf-m6-desafio-24f45-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();
const realtimeDB = admin.database();

export { realtimeDB, firestore };
