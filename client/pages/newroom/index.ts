import { state } from "../../state";

const piedraImg = require("url:../../assets/piedra.svg");
const papelImg = require("url:../../assets/papel.svg");
const tijerasIMG = require("url:../../assets/tijera.svg");
const backgroundIMG = require("url:../../assets/fondo.png");

class NewRoomPage extends HTMLElement {
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
    
    @media (max-width: 330px) {
      .welcome-container {
        padding-top: 0px;
        gap: 0px;
      }
    }

    @media (min-width: 370px) {
      .welcome-container {
        gap: 0px
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
      position: absolute;
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
      gap: 10px;
    }

    @media (max-width: 400px) {
      .page-form {
       gap: 2px;
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

    .name-input,.submit-button{
      box-sizing: border-box;
      height: 80px;
      width: 310px;
      line-height: 50px;
      font-family: Odibee Sans;
      padding: 0px 10px 0px 10px;
      font-size: 45px;
      cursor: pointer;
      letter-spacing: 1px;
    }

    
    @media (max-width: 330px) {
      .name-input,.submit-button{
        box-sizing: border-box;
        height: 70px;
        width: 300px;
        font-family: Odibee Sans;
        padding: 0px 10px 0px 10px;
        font-size: 35px;
        cursor: pointer;
        letter-spacing: 1px;
      }
    }

    .name-input{
      background: #FFFFFF;
      border: 10px solid #182460;
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
     .submit-button,.name-input{
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
      const playerName = e.target.playername.value;

      // VERIFICA QUE SE EL FORM NO PUEDA INGRESARSE VACIO
      if (playerName.trim() !== "") {
        console.log(playerName);
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
    <label class="name-label">Tu Nombre</label>
    <input class="name-input" name="playername"></label>
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
customElements.define("newroom-page", NewRoomPage);
