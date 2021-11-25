import { state } from "../../state";
import { Router } from "@vaadin/router";

const piedraImg = require("url:../../assets/piedra.svg");
const papelImg = require("url:../../assets/papel.svg");
const tijerasIMG = require("url:../../assets/tijera.svg");
const backgroundIMG = require("url:../../assets/fondo.png");

class Home extends HTMLElement {
  shadow: ShadowRoot;
  stateData: any;
  currentGame: any;
  currentScore: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = `
    .welcome-container {
      height: 100vh;
      background-image: url(${backgroundIMG});
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 4%;
    }
    
    @media (min-width: 310px) {
      .welcome-container {
        gap: 10px;
      }
    }

    @media (min-width: 370px) {
      .welcome-container {
        gap: 0px
      }
    }

    @media (min-width: 750px) {
      .welcome-container {
        gap: 13%;
      }
    }

    .score-header{
      padding-top: 20px;
      height: 100px;
      width: 90%;
      display: flex;
      align-self: center;
      flex-direction: row;
      justify-content: space-between;
    }
    
    @media (min-width: 750px) {
      .score-header {
        width: 45%;
        padding-top: 30px;
      }
    }

     .score-title{
      font-family: 'Zilla Slab', serif;
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
     }

     .rival-player{
      color: #1a32a9;
     }


    .players-name,.room-id{
      flex-direction: column;
      display:flex;
      height: 100%;
      gap: 5px;
    }

    .players-name{
      align-items: start;
      align-self: start;
    }

    .room-id{
      align-items: end;
      align-self: end;
    }

    .start-container{ 
      display: none;
      align-self: center;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .code-container{
      display: flex;
      align-self: center;
      flex-direction: column;
    }

    @media (max-width: 750px) {
      .code-container{
        padding-top: 30%;
      }
    }

    .hands-container {
      display: flex;
      gap: 35px;
      bottom: -5%;
    }

    @media (min-width: 750px) {
      .hands-container {
        bottom: -4%;
        gap: 70px;
      }
    }
    
    @media (min-width: 310px) {
      .welcome-hands {
        height: 120px;
      }
    }

    @media (min-width: 370px) {
      .welcome-hands {
        height: 170px;
      }
    }
    
    @media (min-width: 750px) {
      .welcome-hands {
        height: 190px;
      }
    }


    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    // SE ESCUCHA EL STATE GENERANDO QUE CUANDO AMBOS PLAYERS ESTEN ONLINE = TRUE, APAREZCA EL START-CONTAINER
    const startButton = this.shadow.querySelector(".start-button");
    const cs = this.currentGame;
    const playersData = Object.values(cs);

    // DECLARA UN FLAG QUE SI AMBOS JUGADORES ESTAN ONLINE SE DEVOLVERA TRUE
    const bothPlayersOnline =
      cs.player1.online == true && cs.player2.online == true;

    // SI AMBOS JUGADORES ESTAN CONECTADOS, APARECE EL START-CONTAINER
    if (bothPlayersOnline) {
      const codeContainer = this.shadow.querySelector(".code-container");
      const startContainer = this.shadow.querySelector(".start-container");
      codeContainer.setAttribute("style", "display:none");
      startContainer.setAttribute("style", "display:flex");
    }

    // DEVUELVE SI HAY JUGADORES QUE NO HAYAN PRESIONADO START
    const hasPlayersNotStarted = playersData.find((player) => {
      return player["start"] == false;
    });

    // DECLARA UN ARRAY CON LA CANTIDAD DE QUE NO PRESIONARON START
    const notConnectedUsers = playersData.filter((player) => {
      return player["start"] == false;
    });

    // EVENT LISTNER DEL BOTON "JUGAR"
    startButton.addEventListener("click", () => {
      // PIDE AL STATE LA REFERENCIA AL USUARIO QUE ESTA CONECTADO ACTUALMENTE
      const actualPlayerRef = state.getSessionUserRef()[0];

      // SE UTILIZA EL ENDPOINT PARA QUE EL JUGADOR CAMBIE SU START A TRUE
      state.letStartPlayer(actualPlayerRef);
    });

    // PARA QUE ESTO SUCEDA, SOLO TIENE QUE HABER UN SOLO JUGADOR SIN CONECTARSE
    if (notConnectedUsers.length == 1) {
      // SE HACE REFERENCIA AL JUGADOR QUE NO INICIO PARTIDA COINCIDIENDO CON EL PLAYERNAME DEL STATE
      const sessionUserNoReady =
        hasPlayersNotStarted["playerName"] ==
        state.getSessionUserRef()[1]["playerName"];

      // SI EL USUARIO PRESIONO JUGAR Y AUN FALTA QUE EL OTRO USUARIO LO PONGA, SOLO SE LE MODIFICA EL CONTAINER AL QUE SI ESTA LISTO
      if (sessionUserNoReady == false) {
        const startContainer = this.shadow.querySelector(".start-container");

        // SE RENDERIZA EL NUEVO CONTAINER
        startContainer.innerHTML = `
      <in-title>Esperando que ${hasPlayersNotStarted["playerName"]} presione ¡Jugar!...</in-title>
      `;
      }
    }

    // SI AMBOS JUGADORES PRESIONARON TIENEN START = TRUE PASAN AL GAME
    if (!hasPlayersNotStarted) {
      Router.go("/game");
    }
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      this.currentScore = currentState.roomScore;
      this.currentGame = currentState.currentGame;
      this.stateData = currentState;
      this.shadow.children[1].remove();
      this.render();
    });
    const currentState = state.getState();
    this.currentScore = currentState.roomScore;
    this.currentGame = currentState.currentGame;
    this.stateData = currentState;
    this.render();
  }

  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");
    const currentScore = this.currentScore;

    //SE RENDERIZA JUNTO CON LOS DATOS DESDE EL STATE
    mainPage.innerHTML = `
    <header class="score-header">
     <div class="players-name">
     <span class="score-title">${
       currentScore.player1.name !== undefined
         ? currentScore.player1.name + ":"
         : ""
     } ${
      currentScore.player1.score !== undefined ? currentScore.player1.score : ""
    }</in-title></span>
     <span class="score-title rival-player">${
       currentScore.player2.name !== "none"
         ? currentScore.player2.name + ":"
         : ""
     } ${
      currentScore.player2.score !== "none" ? currentScore.player2.score : ""
    }</in-title></span>
     </div>
     <div class="room-id">
     <span class="score-title">Sala</in-title></span>
     <span class="score-title">${this.stateData.roomId}</in-title></span>
    </header>
    <div class="code-container">
     <in-title>Compartí el codigo:</in-title>
     <big-code>${this.stateData.roomId}</big-code>
     <in-title>con tu contrincante</in-title>
    </div>
    <div class="start-container">
     <in-title>Presioná jugar
     y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</in-title>
     <menu-button class="start-button">Jugar!</menu-button>
    </div>
    <div class="hands-container">
     <img class="welcome-hands" src=${tijerasIMG}>
     <img class="welcome-hands" src=${piedraImg}>
     <img class="welcome-hands" src=${papelImg}>
    </div>
 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();

    // SI EL USUARIO CIERRA LA PAGINA, SE REINICIA SU START DE LA RTBD
    window.onbeforeunload = function disconectPlayer() {
      const actualPlayerRef = state.getSessionUserRef()[0];
      state.restartPlayer(actualPlayerRef);
    };
  }
}
customElements.define("waiting-room", Home);
