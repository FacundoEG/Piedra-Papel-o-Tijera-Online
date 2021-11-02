const piedraImg = require("url:../../assets/piedra.svg");
const papelImg = require("url:../../assets/papel.svg");
const tijerasIMG = require("url:../../assets/tijera.svg");

class RockHand extends HTMLElement {
  shadow: ShadowRoot;
  jugada: string;
  img: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.jugada = this.getAttribute("jugada");
  }

  connectedCallback() {
    const style = document.createElement("style");
    style.innerHTML = `
    .hand{
      height: 160px;
      position: absolute;
      bottom: -3%;
      cursor: pointer;
    }

    @media (min-width: 750px){
      .hand{
        height: 240px
      }
    }
  `;
    //LE DOY LA IMAGEN AL COMP CON EL ATRIBUTO JUGADA
    if (this.jugada == "papel") {
      this.img = papelImg;
    }
    if (this.jugada == "tijeras") {
      this.img = tijerasIMG;
    }
    if (this.jugada == "piedra") {
      this.img = piedraImg;
    }

    this.shadow.appendChild(style);
    this.render();
  }

  render() {
    const div = document.createElement("div");
    const img = document.createElement("img");
    //LE AGREGO LA IMAGEN EN RELACION AL ATRIBUTO JUGADA
    img.setAttribute("src", this.img);
    img.classList.add("hand");
    div.appendChild(img);

    div.addEventListener("click", () => {
      img.style.bottom = "10%";

      var event = new CustomEvent("play", {
        detail: {
          jugada: this.jugada,
        },
      });
      this.dispatchEvent(event);
    });

    this.shadow.appendChild(div);
  }
}
customElements.define("hand-comp", RockHand);
