// Guardar info para compartir entre pages / componentes
// Guardar en localStorage lo necesario
// Interactuar con localStorage / API
import { realtimeDB } from "./rtdb";

/* const API_BASE_URL = "http://localhost:3000"; */
const API_BASE_URL = "https://p-p-t-v2.herokuapp.com";

//TYPES
type Jugada = "piedra" | "papel" | "tijeras";
type User = "myPlay" | "computerPlay";
type Score = "myScore" | "computerScore";
type Game = {
  myPlay: Jugada;
  computerPlay: Jugada;
};

const state = {
  data: {
    // SE GUARDA LA JUGADA EN EL MOMENTO
    currentGame: {
      myPlay: "",
      computerPlay: "",
    },

    playerName: null,
    roomId: null,
    roomIdLong: null,

    // SE GUARDAN OBJETOS DENTRO DEL ARRAY CON LAS JUGADAS HECHAS
    history: [],

    // SE GUARDAN LOS RESULTADOS FINALES
    results: { myScore: 0, computerScore: 0 },
  },

  listeners: [],

  ///////// BASIC STATE METHODS //////////

  //GETTER
  getState() {
    return this.data;
  },

  //SETTER
  setState(newState) {
    this.data = newState;
    console.log("El nuevo estado es:", newState);
    for (const callback of this.listeners) {
      callback();
    } /* 
    localStorage.setItem("game", JSON.stringify(newState)); */
  },

  //SUBSCRIBER
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  //////////// BACK-END //////////////

  setPlayerName(nombre: string) {
    const currentState = this.getState();
    currentState.playerName = nombre;
    this.setState(currentState);
  },

  // SETEA EL GAMEROOMID CORTO EN EL STATE
  setGameRoomId(gameRoomId: string) {
    const currentState = this.getState();
    currentState.roomId = gameRoomId;
    this.setState(currentState);
  },

  // SETEA EL ROOMID LARGO EN EL STATE
  setLongRoomId(roomId: string) {
    const currentState = this.getState();
    currentState.roomIdLong = roomId;
    this.setState(currentState);
  },

  // CREA UN NUEVO USUARIO Y DEVUELVE SU ID
  createNewUser(userData) {
    return fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

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

  // CREA UNA NUEVA ROOM PONIENDOLO AL USUARIO COMO OWNER
  createNewGameRoom(gameroomData) {
    return fetch(API_BASE_URL + "/gamerooms", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(gameroomData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // INGRESA EL EMAIL DEL USUARIO Y RECIBE SU USER ID
  getNameAuth(userName) {
    return fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userName),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // DEVUELVE EL ID LARGO DE LA SALA CUANDO LE PASAS EL ID CORTO Y EL NOMBRE DE USUARIO
  getGameRoomLongId(gameRoomId, userId) {
    return fetch(
      API_BASE_URL + "/gamerooms/" + gameRoomId + "?userId=" + userId,
      {
        method: "get",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // IMPORTA LA DATA DEL GAMEROOM
  importGameRoom(roomId) {
    const chatroomRef = realtimeDB.ref("/gamerooms/" + roomId);
    chatroomRef.on("value", (snapshot) => {
      const gameRoomData = snapshot.val();
      console.log(gameRoomData);
    });
  },

  //////////// FRONT-END /////////////

  // 1 - SETEA/DEFINE LA JUGADA REALIZADA
  setMove(move: Jugada, user: User) {
    const currentState = this.getState();
    currentState.currentGame[user] = move;
  },

  // 2 - DEFINE QUIEN GANO LA PARTIDA EN BASE A SET MOVE
  whoWins(myPlay: Jugada, computerPlay: Jugada) {
    //JUGADAS DE VICTORIA
    const ganeConTijeras = myPlay == "tijeras" && computerPlay == "papel";
    const ganeConPiedra = myPlay == "piedra" && computerPlay == "tijeras";
    const ganeConPapel = myPlay == "papel" && computerPlay == "piedra";
    if (ganeConPapel || ganeConTijeras || ganeConPiedra) {
      state.setPoints("myScore");
      return "victoria";
    }

    //JUGADAS DE DERROTA
    const perdiConTijeras = myPlay == "tijeras" && computerPlay == "piedra";
    const perdiConPiedra = myPlay == "piedra" && computerPlay == "papel";
    const perdiConPapel = myPlay == "papel" && computerPlay == "tijeras";
    if (perdiConPapel || perdiConTijeras || perdiConPiedra) {
      state.setPoints("computerScore");
      return "derrota";
    }

    //EMPATES
    const empateConTijeras = myPlay == "tijeras" && computerPlay == "tijeras";
    const empateConPiedras = myPlay == "piedra" && computerPlay == "piedra";
    const empateConPapel = myPlay == "papel" && computerPlay == "papel";
    if (empateConTijeras || empateConPiedras || empateConPapel) {
      return "empate";
    }
  },

  // 3 - AGREGA UN PUNTO, SE PASA QUIEN GANO COMO PARAMETRO
  setPoints(user: Score) {
    const CurrentState = state.getState();
    const score = CurrentState.results[user] + 1;
    CurrentState.results[user] = score;
  },

  // 4- AGREGA LA PARTIDA AL HISTORIAL
  pushNewGameHistory(game: Game) {
    const history = state.getState().history;
    history.push(game);
  },

  //DEFINE LA NUEVA JUGADA EN BASE A LOS ANTERIORES METODOS
  //PUEDE SER UTILIZADO O NO
  definePlay(myPlay: Jugada, computerPlay: Jugada) {
    const currentGame = state.getState().currentGame;

    // 1 - SETEA LOS MOVIMIENTOS
    state.setMove(myPlay, "myPlay");
    state.setMove(computerPlay, "computerPlay");

    //CAPTURA LOS MOVIMIENTOS
    const myMove = currentGame.myPlay;
    const computerMove = currentGame.computerPlay;

    // 2 y 3 - DEFINE QUIEN GANA
    const resulado = state.whoWins(myMove, computerMove);

    // 4 - CREA UN REGISTRO DEL JUEGO Y LO AGREGA AL HISTORIAL
    const newRecord = {
      myPlay: myMove,
      computerPlay: computerMove,
    };
    state.pushNewGameHistory(newRecord);

    //CREA EL NUEVO ESTADO
    const newState = state.getState();
    state.setState(newState);
    return resulado;
  },

  //SI NO HAY REGISTRO DE "GAME", SE ASEGURA DE INICIAR EL STATE VACIO
  restoreState() {
    const firstState = state.getState();
    if (!localStorage.game) {
      state.setState(firstState);
    } else {
      const lastState = localStorage.getItem("game");
      const lastStateParsed = JSON.parse(lastState);
      state.data = lastStateParsed;
    }
  },
};

export { state };
