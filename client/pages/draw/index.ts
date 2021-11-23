import { state } from "../../state";
import { Router } from "@vaadin/router";

const backgroundIMG = require("url:../../assets/fondo.png");
const starIMG = require("url:../../assets/stargreen.svg");

class DrawPage extends HTMLElement {
  shadow: ShadowRoot;
  stateData: any;
  currentGame: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = `

    .draw-container{
    height: 100vh;
    background-image: url(${backgroundIMG}););
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
}

.draw-container {
  background-color: #00459fb0;
}

.star {
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

.star {
  background-image: url(${starIMG});
}

.score-table {
  padding: 5px 30px 30px 30px;
  background: #ffffff;
  border: 10px solid #000000;
  box-sizing: border-box;
  border-radius: 10px;
  width: 259px;
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
      this.currentGame = currentState.currentGame;
      this.stateData = currentState;
    });
    const currentState = state.getState();
    this.currentGame = currentState.currentGame;
    this.stateData = currentState;
    // RENDERIZA LA PAGE
    this.render();
  }
  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("draw-container");

    const playerRef = state.getSessionUserRef()[1];
    const rivalRef = state.getRivalUserRef()[1];

    //SE RENDERIZA
    mainPage.innerHTML = `
    <div class="star">Empate!</div>
    <div class="score-table">
    <h3>Score</h3>
    <h4>${playerRef["playerName"]}: ${0}</h4>
    <h4>${rivalRef["playerName"]}: ${0}</h4>
    </div>
    <menu-button class="waitingroom-button">Regresar a la sala</menu-button>
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
customElements.define("draw-page", DrawPage);
