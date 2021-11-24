import { state } from "../../state";
import { Router } from "@vaadin/router";

const backgroundIMG = require("url:../../assets/fondo.png");
const winStarIMG = require("url:../../assets/stargreen.svg");

class WinPage extends HTMLElement {
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

    .win-container{
    height: 100vh;
    background-image: url(${backgroundIMG}););
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
}

.win-container {
    background-color: rgba(136, 137, 73, 0.9);
}

.win-star {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 259px;
  width: 254px;
  text-shadow: 0 0 2px black;
  background: no-repeat;
  font-family: "Odibee Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 50px;
  color: white;
  letter-spacing: 1px;
}

.win-star {
  background-image: url(${winStarIMG});
}

.score-table {
  padding: 5px 30px 30px 30px;
  background: #ffffff;
  border: 10px solid #000000;
  box-sizing: border-box;
  border-radius: 10px;
  height: 217px;
}

.score-table h3 {
  margin: 0 auto 10px;
  text-align: center;
  font-family: "Odibee Sans";
  font-size: 55px;
}

.score-table h4 {
  margin: 0;
  text-align: center;
  font-family: "Odibee Sans";
  font-size: 45px;
  text-align: right;
}
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    const gameroomButton = this.shadow.querySelector(".waitingroom-button");

    // SI EL PLAYER ELIJE "REGRESAR A LA SALA" ES ENVIADO A LA WAITINGROOM
    gameroomButton.addEventListener("click", () => {
      Router.go("/waitingroom");
    });
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
    mainPage.classList.add("win-container");

    const currentScore = this.currentScore;

    //SE RENDERIZA
    mainPage.innerHTML = `
    <div class="win-star">Ganaste!</div>
    <div class="score-table">
    <h3>Score</h3>
    <h4>${currentScore.player1.name}: ${currentScore.player1.score}</h4>
    <h4>${currentScore.player2.name}: ${currentScore.player2.score}</h4>
    </div>
    <menu-button class="waitingroom-button">Volver a jugar!</menu-button>
    `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();

    // SI EL USUARIO CIERRA LA PAGINA, SU USUARIO SE DESCOENCTA DE LA RTBD
    window.onbeforeunload = function disconectPlayer() {
      const actualPlayerRef = state.getSessionUserRef()[0];
      state.disconnectPlayer(actualPlayerRef);
    };
  }
}
customElements.define("win-page", WinPage);
