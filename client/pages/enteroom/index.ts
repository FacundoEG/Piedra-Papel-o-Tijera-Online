import { state } from "../../state";

const piedraImg = require("url:../../assets/piedra.svg");
const papelImg = require("url:../../assets/papel.svg");
const tijerasIMG = require("url:../../assets/tijera.svg");
const backgroundIMG = require("url:../../assets/fondo.png");

class EnterRoomPage extends HTMLElement {
  shadow: ShadowRoot;
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
      justify-content: space-between;
    }
    
    @media (max-width: 330px) {
      .welcome-container {
        padding-top: 0px;
        gap: 0px;
      }
    }

    @media (min-width: 370px) {
      .welcome-container {
        gap: 1%;
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
    
    @media (max-width: 330px) {
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

    .page-form{
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    @media (max-width: 330px) {
      .page-form {
       margin-top: 0px;
       gap: 2px;
      }
    }

    @media (min-width: 750px) {
      .page-form {
       gap: 10px;
      }
    }

    .name-label{
      font-size: 45px;
      text-align: center;
      letter-spacing: 0.05em;
      font-family: Odibee Sans;
      font-size: 45px;
      line-height: 50px;
    }

    .code-input,.submit-button{
      box-sizing: border-box;
      height: 70px;
      width: 310px;
      line-height: 50px;
      font-family: Odibee Sans;
      padding: 0px 10px 0px 10px;
      font-size: 45px;
      cursor: pointer;
      letter-spacing: 1px;
    }

    
    @media (max-width: 330px) {
      .code-input,.submit-button{
        box-sizing: border-box;
        height: 65px;
        width: 300px;
        font-family: Odibee Sans;
        padding: 0px 10px 0px 10px;
        font-size: 35px;
        cursor: pointer;
        letter-spacing: 1px;
      }
    }

    @media (min-width: 750px) {
      .code-input,.submit-button{
        box-sizing: border-box;
        height: 80px;
        width: 300px;
        font-family: Odibee Sans;
        padding: 0px 10px 0px 10px;
        font-size: 45px;
        cursor: pointer;
        letter-spacing: 1px;
      }
    }

    .code-input{
      background: #FFFFFF;
      border: 10px solid #182460;
      font-family: Odibee Sans;
      border-radius: 10px;
      text-align: center;
    }

    .submit-button{
      background-color: #006CFC;
      border: 10px solid #001997;
      border-radius: 15px;
      color: #D8FCFC;
    }

    .submit-button:active{
      background-color: #001997;
      border: 10px solid #006CFC;
      color: white
    }
    
   @media (min-width: 750px){
     .submit-button,.code-input{
       width: 340px;
     }
   }
   
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    // LISTENER DEL BOTON "EMPEZAR"
    const pageForm = this.shadow.querySelector(".page-form");
    pageForm.addEventListener("submit", (e: any) => {
      e.preventDefault();
      // SE TOMA EL INPUT DEL ROOM ID INGRESADO
      const roomCode = e.target.roomcode.value;
      const playerName = e.target.playername.value;

      // VERIFICA QUE SE EL FORM NO PUEDA INGRESARSE VACIO
      if (roomCode.trim() !== "" && playerName.trim() !== "") {
        state.setPlayerName(playerName);

        const userData = {
          name: playerName,
        };

        // VERIFICA QUE EL USUARIO INGRESE UN NOMBRE REGISTRADO
        const nameAuthPromise = state.getNameAuth(userData);
        nameAuthPromise.then((res) => {
          // SI EL NOMBRE NO EXISTE, CREA EL NUEVO USER Y SE AUTENTICA CON ESE ID
          if (res.message) {
            const newUserPromise = state.createNewUser(userData);
            newUserPromise.then((res) => {
              if (res.id) {
                const userAuthId = res.id;
                state.setGameRoomId(roomCode);

                // SE HACE UN GET PARA PODER ADQUIRIR EL ID LARGO DE LA ROOM
                const getGameRoomPromise = state.getGameRoomLongId(
                  roomCode,
                  userAuthId
                );

                getGameRoomPromise.then((res) => {
                  // SI EXISTE UN ERROR SE LE AVISA AL USUARIO
                  if (res.message) {
                    alert(res.message);
                  }

                  // AL OBTENER EL ID LARGO, SE AGREGA AL STATE Y SE DEFINE EL STATE
                  if (res.rtdbRoomId) {
                    state.setLongRoomId(res.rtdbRoomId);
                    state.connectToGamerooms(res.rtdbRoomId);

                    // SE ESTABLECE UN LISTENER PARA LA CONEXION QUE CAMBIARA DE PAGINA SOLO CUANDO CURRENTGAMEFLAG SEA TRUE
                    const conectionListener = setInterval(() => {
                      if (state.currentGameFlag()) {
                        clearInterval(conectionListener);
                        state.redirectPlayers();
                      }
                    }, 500);
                  }
                });
              }
            });
          }

          // SI EL NOMBRE EXISTE, SE RECIBE EL USER ID
          if (res.id) {
            const userAuthId = res.id;
            state.setGameRoomId(roomCode);

            // SE HACE UN GET PARA PODER ADQUIRIR EL ID LARGO DE LA ROOM
            const getGameRoomPromise = state.getGameRoomLongId(
              roomCode,
              userAuthId
            );

            getGameRoomPromise.then((res) => {
              // SI EXISTE UN ERROR SE LE AVISA AL USUARIO
              if (res.message) {
                alert(res.message);
              }

              // AL OBTENER EL ID LARGO, SE AGREGA AL STATE Y CONECTA A LOS JUGADORES A LA PARTIDA
              if (res.rtdbRoomId) {
                state.setLongRoomId(res.rtdbRoomId);
                state.connectToGamerooms(res.rtdbRoomId);

                // SE ESTABLECE UN LISTENER PARA LA CONEXION QUE CAMBIARA DE PAGINA SOLO CUANDO CURRENTGAMEFLAG SEA TRUE
                const conectionListener = setInterval(() => {
                  if (state.currentGameFlag()) {
                    clearInterval(conectionListener);
                    state.redirectPlayers();
                  }
                }, 500);
              }
            });
          }
        });
      }
    });
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    // RENDERIZA LA PAGE
    this.render();
  }
  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");

    //SE RENDERIZA
    mainPage.innerHTML = `
    <welcome-title>Piedra Papel o Tijera</welcome-title>
    <form class="page-form">
    <input class="code-input" name="playername" placeholder="tu nombre"></input>
    <input class="code-input" name="roomcode" placeholder="codigo"></input>
    <button class="submit-button">Empezar</button>
    </form>
    <div class="hands-container">
    <img class="welcome-hands" src=${tijerasIMG}>
    <img class="welcome-hands" src=${piedraImg}>
    <img class="welcome-hands" src=${papelImg}>
    </div>
 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("enteroom-page", EnterRoomPage);
