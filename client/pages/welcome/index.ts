import { state } from "../../state";
import { Router } from "@vaadin/router";

const piedraImg = require("url:../../assets/piedra.svg");
const papelImg = require("url:../../assets/papel.svg");
const tijerasIMG = require("url:../../assets/tijera.svg");
const backgroundIMG = require("url:../../assets/fondo.png");

class Home extends HTMLElement {
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

    .menu-div{
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    @media (max-width: 400px) {
      .menu-div {
       gap: 2px;
      }
    }
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    // LISTENER DEL BOTON "NUEVO JUEGO"
    const newGameButton = this.shadow.querySelector(".newgame-button");
    newGameButton.addEventListener("click", () => {
      Router.go("/newroom");
    });

    // LISTENER DEL BOTON "NUEVO JUEGO"
    const enterRoomButton = this.shadow.querySelector(".enter-room-button");
    enterRoomButton.addEventListener("click", () => {
      Router.go("/enteroom");
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
    <div class="menu-div">    
    <menu-button class="newgame-button">Nuevo juego</menu-button>
    <menu-button class="enter-room-button">Ingresar a una sala</menu-button>
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
  }
}
customElements.define("home-page", Home);
