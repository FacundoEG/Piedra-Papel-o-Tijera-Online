import { Router } from "@vaadin/router";

const backgroundIMG = require("url:../../assets/fondo.png");

class RefusedPage extends HTMLElement {
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
    }
    
    @media (min-width: 310px) {
      .welcome-container {
        padding-top: 0px;
        gap: 8px;
      }
    }

    @media (min-width: 370px) {
      .welcome-container {
        padding-top: 30px;
      }
    }

    @media (min-width: 750px) {
      .welcome-container {
        padding-top: 40px;
        gap: 4%;
      }
    }
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    // LISTENER DEL BOTON "REGRESAR"
    const newGameButton = this.shadow.querySelector(".return-button");
    newGameButton.addEventListener("click", () => {
      console.log("Boton para crear un juego nuevo");
      Router.go("/");
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
    <in-title>Ups, esta sala está completa o tu nombre no coincide con nadie en la sala.</in-title>
    <menu-button class="return-button">Regresar al menu</menu-button>
 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("refused-page", RefusedPage);
