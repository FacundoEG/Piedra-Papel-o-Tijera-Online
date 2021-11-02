import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "nDlevrKYq5Ca87qrMX1gOkLrAaZh81C75XiBN76T",
  authDomain: "dwf-m6-desafio-24f45.firebaseapp.com",
  databaseURL: "https://dwf-m6-desafio-24f45-default-rtdb.firebaseio.com",
});

const realtimeDB = firebase.database();

export { realtimeDB };
