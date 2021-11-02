// Guardar info para compartir entre pages / componentes
// Guardar en localStorage lo necesario
// Interactuar con localStorage / API

import { realtimeDB } from "./rtdb";

type Message = {
  from: string;
  message: string;
};

const state = {
  data: {
    nombre: null,
    roomId: null,
    roomIdLong: null,
    email: null,
    messages: [],
  },
  listeners: [],

  connectToGamerooms() {
    const chatRoomRef = realtimeDB.ref("/gamerooms/1234/current-game");
    chatRoomRef.on("value", (snap) => {
      let value = snap.val();
      console.log(value);

      let cantidadDeJugadores = Object.entries(value).length;

      if (cantidadDeJugadores == 2) {
        console.log("la sala esta llena");
      }
    });
  },
};

export { state };
