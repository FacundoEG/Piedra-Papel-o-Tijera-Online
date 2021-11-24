import { state } from "../../state";
import { Router } from "@vaadin/router";

const piedraImg = require("url:../../assets/piedra.svg");
const papelImg = require("url:../../assets/papel.svg");
const tijerasIMG = require("url:../../assets/tijera.svg");
const backgroundIMG = require("url:../../assets/fondo.png");

class Game extends HTMLElement {
  shadow: ShadowRoot;
  stateData: any;
  currentGame: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = `
    .welcome-container {
      padding-top: 30px;
      height: 100vh;
      background-image: url(${backgroundIMG});
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4%;
      justify-content: space-between;
    }
    
    @media (min-width: 310px) {
      .welcome-container {
        padding-top: 0px;
        gap: 10px;
      }
    }

    @media (min-width: 370px) {
      .welcome-container {
        padding-top: 30px;
        gap: 3%
      }
    }

    @media (min-width: 750px) {
      .welcome-container {
        padding-top: 40px;
        gap: 4%;
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

    .player-container {
      display: flex;
      margin: 0 auto;
      width: 310px;
      gap: 120px;
      height: 50vh;
    }

    @media (min-width: 750px) {
      .player-container {
        display: flex;
        margin: 0 auto;
        width: 425px;
        gap: 160px;
        height: 50vh;
      }
    }

    .final-game-container {
      display: flex;
      margin: 0 auto;
      width: 100px;
      height: 50vh;
      justify-self: center;
    }
    
    .progress-ring {
      margin-top: 60px;
    }

    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    //RECIBE EL EVENTO CON LA MANO EL JUGADOR
    const playerCont = this.shadow.querySelector(".player-container");
    const handsArray = playerCont.children;
    for (const hand of handsArray) {
      hand.addEventListener("play", (e: any) => {
        let jugada = e.detail.jugada;
        const actualPlayerRef = state.getSessionUserRef()[0];

        state.makeHandChoice(actualPlayerRef, jugada);
      });
    }
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      this.currentGame = currentState.currentGame;
      this.stateData = currentState;
    });
    // PIDE LA DATA DEL STATE RENDERIZA LA PAGE
    const currentState = state.getState();
    this.currentGame = currentState.currentGame;
    this.stateData = currentState;
    this.render();
  }

  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");

    //SE INICIALIZAN LOS CONTADORES
    let counter = 3;
    let progress = 0;

    //SE DECLARA LA FUNCION DE LA CUENTA ATRAS QUE HACE PROGRESAR LA BARRA
    function counterInit() {
      const ring = mainPage.children[0];
      const ringText = ring.shadowRoot.children[0].children[0].children[0];
      counter--,
        (progress += 33.3),
        (ringText.textContent = `${counter}`),
        ring.setAttribute("progress", `${progress}`);
    }

    // SE CREA LA VARIABLE "TIMEOUT" JUNTO CON LA FUNCIÓN, QUE ES UN CONTADOR QUE ESPERA 3 SEGUNDOS Y LUEGO REALIZA UNA ACCIÓN
    var timeout;
    function setTimeOut(mainPage) {
      timeout = setTimeout(() => {
        clearInterval(contador);

        function definePlay(mainPage) {
          const cs = state.getState();
          const cg = cs.currentGame;
          const playersData = Object.values(cg);

          const playerData = state.getSessionUserRef()[1];
          const rivalData = state.getRivalUserRef()[1];

          // DEVUELVE SI HAY JUGADORES QUE NO HAYAN JUGADO NINGUNA MANO
          const playersDontChoice = playersData.find((player) => {
            return player["choice"] == "undefined";
          });

          // SI ALGUNO DE LOS JUGADORES NO ELIGE NINGUNA MANO
          if (playersDontChoice) {
            const playerDontChoiceName = playersDontChoice["playerName"];

            mainPage.style.justifyContent = "center";
            mainPage.innerHTML = `
            <in-title>Lo siento, pero el jugador ${playerDontChoiceName} no ha elegido ninguna mano.</in-title>
            <menu-button class="waitingroom-button">Volver a la sala</menu-button>
            `;

            const newGameButton = mainPage.querySelector(".waitingroom-button");
            newGameButton.addEventListener("click", () => {
              const actualPlayerRef = state.getSessionUserRef()[0];
              const restartPromise = state.restartPlayer(actualPlayerRef);
              restartPromise.then(() => {
                Router.go("/waitingroom");
              });
            });
          }

          // SI AMBOS JUGADORES JUEGAN
          if (!playersDontChoice) {
            // SE GUARDA EL MOVIMIENTO DE CADA JUGADOR
            const playerMove = playerData["choice"];
            const rivalMove = rivalData["choice"];

            // SE RENDERIZAN LAS MANOS EN EL MAINPAGE JUNTO CON SUS CARACTERISTICAS
            mainPage.innerHTML = `
              <div class="final-game-container"></>
              <hand-comp jugada=${rivalMove}></hand-comp>
              <hand-comp jugada=${playerMove}></hand-comp>
              </div>
              `;

            const handPlayerEl = mainPage.getElementsByTagName("hand-comp");
            handPlayerEl[1].shadowRoot.children[0].innerHTML = `
               .hand{
              height: 240px;
              position: absolute;
              bottom: 5%;
              cursor: pointer;
              }
              `;

            handPlayerEl[0].shadowRoot.children[0].innerHTML = `
              .hand{
               height: 220px;
               position: absolute;
               top: 5%;
               cursor: pointer;
              transform: rotate(180deg);
              }
              `;

            // SE GUARDA EL RESULTADO DE LA PARTIDA PARA CADA PLAYER
            const finalResult = state.definePlay(playerMove, rivalMove);

            //ESTA FUNCION REDIRECCIONA AL JUGADOR A LA PAGINA DEPENDIENDO EL RESULTADO FINAL
            function redirect() {
              const actualPlayerRef = state.getSessionUserRef()[0];
              const restartPromise = state.restartPlayer(actualPlayerRef);

              // SI EL JUGADOR GANA, SE ADQUIEREN SU REFERENCIA Y EL ROOMID
              if (finalResult == "victoria") {
                const cs = state.getState();
                const roomId = cs.roomId;
                const actualPlayerRef = state.getSessionUserRef();
                const userName = actualPlayerRef[1]["playerName"];
                const userRef = actualPlayerRef[0];

                // SE PREPARA EL BODY PARA LA PETICIÓN DE AGREGAR UN PUNTO AL SCORE
                const userData = {
                  playerName: userName,
                  playerRef: userRef,
                };

                // SE DECLARA LA PROMESA DE AGREGAR UN PUNTO AL GANADOR
                const addWinnerScorePromise = state.addWinScore(
                  userData,
                  roomId
                );

                // UNA VEZ QUE LA PROMESA SE RESUELVE, SE VA A LA WIN PAGE
                addWinnerScorePromise.then(() => {
                  restartPromise.then(() => {
                    Router.go("/win-page");
                  });
                });
              }

              // SI EL JUGADOR PERDIO, NO SE LE AGREGA PUNTOS
              if (finalResult == "derrota") {
                restartPromise.then(() => {
                  Router.go("/lose-page");
                });
              }

              // SI AMBOS JUGADORES EMPATAN, NO RECIBEN PUNTOS
              if (finalResult == "empate") {
                restartPromise.then(() => {
                  Router.go("/draw-page");
                });
              }
            }

            //A LOS 2 SEGUNDOS DE DEVOLVER EL RESULTADO SE REDIRECCIONA A LOS JUGADORES
            setTimeout(() => {
              redirect();
            }, 2000);
          }
        }

        definePlay(mainPage);
      }, 3999);
    }

    //SE RENDERIZA
    mainPage.innerHTML = `
     <progress-ring stroke="20" radius="150" progress="0" contador="3"></progress-ring>
   
     <div class="player-container"></>
     <hand-comp jugada="tijeras"></hand-comp>
     <hand-comp jugada="papel"></hand-comp>
     <hand-comp jugada="piedra"></hand-comp>
     `;

    this.shadow.appendChild(mainPage);

    // CREA UN CONTADOR QUE HACE PROGRESAR EL RING Y LO REDUCE
    const contador = setInterval(counterInit, 1000);

    // SE EL CONTADOR "TIMEOUT", DONDE SE ESPERA QUE EL JUGADOR ELIJA, SI NO ELIGE SUCEDE ALGO
    setTimeOut(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();

    // SI EL USUARIO CIERRA LA PAGINA, SU USUARIO SE DESCOENCTA DE LA RTBD
    window.onbeforeunload = function disconectPlayer() {
      console.log("esta funcando el onbefore");
      const actualPlayerRef = state.getSessionUserRef()[0];
      state.disconnectPlayer(actualPlayerRef);
    };
  }
}
customElements.define("game-page", Game);
