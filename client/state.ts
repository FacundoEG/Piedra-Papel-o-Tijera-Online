// Guardar info para compartir entre pages / componentes
// Guardar en localStorage lo necesario
// Interactuar con localStorage / API
import { Router } from "@vaadin/router";
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
      /* 
      player1: {
        choice: "undefined",
        online: true,
        playerName: "Pepe",
        playerScore: 0,
        start: true,
      },
      player2: {
        choice: "undefined",
        online: true,
        playerName: "Juan",
        playerScore: 0,
        start: true,
      }, */
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

  // DEVUELVE LA REFEFENCIA DE LA POSICIÓN DEL USUARIO QUE ESTA CONECTADO ACTUALMENTE
  getSessionUserRef() {
    const cs = state.getState();
    const cg = cs.currentGame;
    const result = Object.entries(cg);
    const sessionUser = result.find((player) => {
      return player[1]["playerName"] === state.getState().playerName;
    });
    return sessionUser;
  },

  getRivalUserRef() {
    const cs = state.getState();
    const cg = cs.currentGame;
    const result = Object.entries(cg);
    const rivalUser = result.find((player) => {
      return player[1]["playerName"] !== state.getState().playerName;
    });
    return rivalUser;
  },

  // IMPORTA LA DATA DEL GAMEROOM Y ESCUCHA LOS CAMBIOS
  connectToGamerooms(roomId) {
    const chatroomRef = realtimeDB.ref("/gamerooms/" + roomId + "/currentgame");
    chatroomRef.on("value", (snapshot) => {
      const gameRoomData = snapshot.val();
      const playersReference = Object.entries(gameRoomData);

      // CARGA LA DATA AL STATE
      const currentState = this.getState();
      currentState.currentGame = gameRoomData;
      this.setState(currentState);
    });
  },

  // REDIRECCIONA A LOS JUGADORES DEPENDIENDO COMO ESTE EL STATE
  redirectPlayers() {
    const cs = state.getState();
    const currentGame = cs.currentGame;

    // SI EL PLAYER 1 ESTA DESCONECTADO
    if (
      currentGame.player1.playerName == "none" &&
      currentGame.player1.online == false
    ) {
      // PROMESA DE CONEXIÓN DEL JUGADOR 1
      const playerConnectionPromise = state.connectPlayer("player1");

      playerConnectionPromise.then(() => {
        Router.go("/waitingroom");
      });
    }

    // SI EL PLAYER 1 ESTA CONECTADO Y EL 2 DESCONECTADO
    if (
      currentGame.player1.playerName !== "none" &&
      currentGame.player1.online !== false &&
      currentGame.player2.playerName === "none" &&
      currentGame.player2.online === false
    ) {
      // PROMESA DE CONEXIÓN DEL JUGADOR 2
      const playerConnectionPromise = state.connectPlayer("player2");

      playerConnectionPromise.then(() => {
        Router.go("/waitingroom");
      });
    }

    // SI AMBOS PLAYERS ESTAN CONECTADOS
    else if (
      currentGame.player1.online === true &&
      currentGame.player1.online === true
    ) {
      Router.go("/refused");
    }
  },

  // VERIFICA QUE SI HAY PLAYER 1 Y PLAYER 2 EN CURRENT GAME, DEVUELVA UN TRUE
  currentGameFlag() {
    let cs = state.getState();
    let currentGame = cs.currentGame;
    if (currentGame.player1 && currentGame.player2) {
      return true;
    }
  },

  // CONECTA A LOS JUGADORES A LA GAMEROOM
  connectPlayer(player: string) {
    const currentState = this.getState();
    const currentGameData = currentState.currentGame[`${player}`];

    // TOMA EL NOMBRE Y EL ROOMID
    const gameRoomId = currentState.roomIdLong;
    const playerName = currentState.playerName;

    const connectedUserData = {
      ...currentGameData,
      online: true,
      playerName: playerName,
    };

    // ACTUALIZA LA DATA DENTRO DE LA RTDB
    return fetch(
      API_BASE_URL + "/gamedata/" + gameRoomId + "?player=" + player,
      {
        headers: { "content-type": "application/json" },
        method: "post",
        body: JSON.stringify(connectedUserData),
      }
    );
  },

  // CONECTA A LOS JUGADORES A LA GAMEROOM
  letStartPlayer(player: string) {
    const currentState = this.getState();
    const currentGameData = currentState.currentGame[`${player}`];

    // TOMA EL ROOMID
    const gameRoomId = currentState.roomIdLong;

    const connectedUserData = {
      ...currentGameData,
      start: true,
    };

    // ACTUALIZA LA DATA DENTRO DE LA RTDB
    return fetch(
      API_BASE_URL + "/gamestart/" + gameRoomId + "?player=" + player,
      {
        headers: { "content-type": "application/json" },
        method: "post",
        body: JSON.stringify(connectedUserData),
      }
    );
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
