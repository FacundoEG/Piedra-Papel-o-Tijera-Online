import { Router } from "@vaadin/router";
import { realtimeDB } from "./rtdb";

const API_BASE_URL = "https://p-p-t-v2.herokuapp.com";

//TYPES
type Jugada = "piedra" | "papel" | "tijeras";
type User = "myPlay" | "computerPlay";

const state = {
  data: {
    // DATA DEL STATE INICIAL
    currentGame: {},
    playerName: null,
    roomId: null,
    roomIdLong: null,
    roomScore: null,
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
    }
    sessionStorage.setItem("actualgame", JSON.stringify(newState));
  },

  //SUBSCRIBER
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  // SETEA EL NOMBRE DEL JUGADOR
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

  //////////// BACK-END METHODS //////////////

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

  // AGREGA EL SCORE DEL PLAYER 2 A FIRESTORE UNA VEZ QUE SE AGREGA UN SEGUNDO JUGADOR A LA SALA
  setPlayer2Score(playerData, roomId) {
    return fetch(API_BASE_URL + "/gameroomsscore/" + roomId, {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(playerData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // AGREGA UN PUNTO AL JUGADOR QUE GANO LA PARTIDA DENTRO DEL GAMEROOM DE FIRESTORE
  addWinScore(playerData, roomId) {
    return fetch(API_BASE_URL + "/gamedatascore/" + roomId, {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(playerData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // TRAE LA DATA DE LOS SCORES DEL GAMERROM GUARDADOS EN FIREBASE
  importGameRoomScore(roomId) {
    return fetch(API_BASE_URL + "/gameroomsscores/" + roomId, {
      method: "get",
      headers: { "content-type": "application/json" },
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

  // DEVUELVE LA REFEFENCIA DEL RIVAL DEL USUARIO QUE ESTA CONECTADO ACTUALMENTE
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

      // CARGA LA DATA AL STATE
      const currentState = this.getState();
      currentState.currentGame = gameRoomData;

      const fireBaseScorePromise = state.importGameRoomScore(
        currentState.roomId
      );

      fireBaseScorePromise.then((scoreData) => {
        currentState.roomScore = scoreData;
        this.setState(currentState);
      });
    });
  },

  // RECONECTA AL JUGADOR AL RECARGAR LA AL GAMEROOM Y ESCUCHA LOS CAMBIOS
  reconnectToGamerooms(roomId) {
    const chatroomRef = realtimeDB.ref("/gamerooms/" + roomId + "/currentgame");
    chatroomRef.on("value", (snapshot) => {
      const gameRoomData = snapshot.val();
      console.log(gameRoomData);

      // CARGA LA DATA AL STATE
      const currentState = this.getState();
      currentState.currentGame = gameRoomData;
    });
  },

  // REDIRECCIONA A LOS JUGADORES DEPENDIENDO COMO ESTE EL STATE
  redirectPlayers() {
    const cs = state.getState();
    const currentGame = cs.currentGame;
    const statePlayerName = cs.playerName;
    const playersData = Object.values(currentGame);

    //  SE PIDE UNA REFERENCIA DE LOS USUARIOS YA REGISTRADOS
    const registeredPlayer = playersData.find((player) => {
      return player["playerName"].includes(statePlayerName);
    });

    // SI EL PLAYER 1 ESTA DESCONECTADO Y NO REGISTRADO LO CONECTA AL PLAYER 1
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

    // SI EL PLAYER 1 ESTA CONECTADO Y REGISTRADO & EL 2 DESCONECTADO Y SIN REGISTRAR, LO REGISTRA/CONECTA AL PLAYER 2 EN AMBAS DB
    else if (
      currentGame.player1.playerName !== "none" &&
      currentGame.player1.online !== false &&
      currentGame.player2.playerName === "none" &&
      currentGame.player2.online === false
    ) {
      // SE VUELVEN A PEDIR LOS DATOS AL STATE
      const cs = state.getState();
      const actualRoomId = cs.roomId;
      const stateName = cs.playerName;

      const newUserScoreData = {
        playerName: stateName,
      };

      // SE REALIZA LA PROMESA PARA AGREGAR AL NUEVO JUGADOR A LOS SCORES DE FIREBASE
      const player2ScorePromise = state.setPlayer2Score(
        newUserScoreData,
        actualRoomId
      );

      // PROMESA DE CONEXIÓN DEL JUGADOR 2
      player2ScorePromise.then(() => {
        const playerConnectionPromise = state.connectPlayer("player2");
        playerConnectionPromise.then(() => {
          Router.go("/waitingroom");
        });
      });
    }

    // SI AMBOS USUARIOS ESTAN DECONECTADOS
    else if (
      currentGame.player1.online === false ||
      currentGame.player2.online === false
    ) {
      // VERIFICA QUE SI ESTAN REGISTRADOS SE CONECTAN Y PASAN AL WAITING ROOM
      if (registeredPlayer) {
        state.connectPlayer(state.getSessionUserRef()[0]);
        Router.go("/waitingroom");
      }
      // SI NO ESTAN REGISTRADOS SE VAN A REFUSED
      if (!registeredPlayer) {
        Router.go("/refused");
      }
    }

    // SI AMBOS PLAYERS ESTAN CONECTADOS Y REGISTRADOS
    else if (
      currentGame.player1.online === true &&
      currentGame.player2.online === true
    ) {
      // REVISA QUE EL USUARIO INGRESE EL NOMBRE DE ALGUN USUARIO REGISTRADO, DE NO SER ASÍ, LO ENVIA A /REFUSED
      registeredPlayer ? Router.go("/waitingroom") : Router.go("/refused");
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

  // VERIFICA QUE EL ROOMSCORE NO ESTE VACIO DEVOLVIENDO TRUE DE SER ASÍ
  currentScoreFlag() {
    let cs = state.getState();
    let currentScore = cs.roomScore;
    if (currentScore !== null) {
      return true;
    }
  },

  // CONECTA A LOS JUGADORES A LA GAMEROOM
  connectPlayer(player: string) {
    const currentState = this.getState();
    const currentGameData = currentState.currentGame[`${player}`];

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

  /*   // DESCONECTA A LOS JUGADORES A LA GAMEROOM (ESTA COMENTADO AL SER UNA PRUEBA)
  disconnectPlayer(player: string) {
    const currentState = this.getState();
    const currentGameData = currentState.currentGame[`${player}`];

    // TOMA EL ROOMID
    const gameRoomId = currentState.roomIdLong;

    const connectedUserData = {
      ...currentGameData,
      choice: "undefined",
      online: false,
      start: false,
    };

    // ACTUALIZA LA DATA DENTRO DE LA RTDB
    return fetch(
      API_BASE_URL + "/disconectplayer/" + gameRoomId + "?player=" + player,
      {
        headers: { "content-type": "application/json" },
        method: "post",
        body: JSON.stringify(connectedUserData),
      }
    );
  }, */

  // REINICIA EL CONTADOR START DEL JUGADOR
  restartPlayer(player: string) {
    const currentState = this.getState();
    const currentGameData = currentState.currentGame[`${player}`];

    // TOMA EL ROOMID
    const gameRoomId = currentState.roomIdLong;

    const connectedUserData = {
      ...currentGameData,
      choice: "undefined",
      online: true,
      start: false,
    };

    // ACTUALIZA LA DATA DENTRO DE LA RTDB
    return fetch(
      API_BASE_URL + "/restartplayer/" + gameRoomId + "?player=" + player,
      {
        headers: { "content-type": "application/json" },
        method: "post",
        body: JSON.stringify(connectedUserData),
      }
    );
  },

  // INDICA QUE EL JUGADOR ESTA LISTO PARA EMPEZAR
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

  // SELECCIONA LA JUGADA DE LA MANO
  makeHandChoice(player: string, move: string) {
    const currentState = this.getState();
    const currentGameData = currentState.currentGame[`${player}`];

    // TOMA EL ROOMID
    const gameRoomId = currentState.roomIdLong;

    const connectedUserData = {
      ...currentGameData,
      choice: move,
    };

    // ACTUALIZA LA DATA DENTRO DE LA RTDB
    return fetch(
      API_BASE_URL + "/handchoice/" + gameRoomId + "?player=" + player,
      {
        headers: { "content-type": "application/json" },
        method: "post",
        body: JSON.stringify(connectedUserData),
      }
    );
  },

  //////////// FRONT-END METHODS /////////////

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
      return "victoria";
    }

    //JUGADAS DE DERROTA
    const perdiConTijeras = myPlay == "tijeras" && computerPlay == "piedra";
    const perdiConPiedra = myPlay == "piedra" && computerPlay == "papel";
    const perdiConPapel = myPlay == "papel" && computerPlay == "tijeras";
    if (perdiConPapel || perdiConTijeras || perdiConPiedra) {
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

    // 2 - DEFINE QUIEN GANA
    const resulado = state.whoWins(myMove, computerMove);

    return resulado;
  },

  //////////// RESTORE STATE METHODS /////////////

  //SI NO HAY REGISTRO DE "ACTUALGAME", SE ASEGURA DE INICIAR EL STATE VACIO
  restoreState() {
    const firstState = state.getState();
    if (!sessionStorage.actualgame) {
      state.setState(firstState);
    } else {
      // SI HAY REGISTRO DE "ACTUALGAME" CARGA EL ESTADO CON EL ACTUALGAME Y RECONECTA A LA RTDB
      const lastState = sessionStorage.getItem("actualgame");
      const lastStateParsed = JSON.parse(lastState);
      state.setState(lastStateParsed);
      state.connectToGamerooms(lastStateParsed["roomIdLong"]);
    }
  },
};

export { state };
