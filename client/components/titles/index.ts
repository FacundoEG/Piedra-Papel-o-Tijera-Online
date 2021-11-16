class WelcomePageTitle extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .title{
      margin: 0;
      box-sizing: border-box;
      font-family: 'Zilla Slab', serif;
      font-weight: 700;
      text-shadow: 0 0 2px black;
      font-size: 75px;
      color: #009048;
      width: 260px;
      letter-spacing: 2px
    }

    @media (min-width: 750px){
          .title{
            font-size: 80px;
            width: 270px;
          }
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("h1");
    text.classList.add("title");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("welcome-title", WelcomePageTitle);

class InstructionsTitle extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .title{
      box-sizing: border-box;
      margin: 0 auto;
      font-family: 'Zilla Slab', serif;
      text-align: center;
      font-style: normal;
      font-weight: 400;
      text-shadow: 0 0 1.5px black;
      font-size: 40px;
      color: #000000;
      width: 370px;
    }
    @media (max-width: 321px) {
      .title {
      font-size: 35px;
      width: 320px;
      }
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("h1");
    text.classList.add("title");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("in-title", InstructionsTitle);

class BigCode extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .title{
      margin: 0;
      box-sizing: border-box;
      font-family: 'Zilla Slab', serif;
      font-weight: 700;
      text-shadow: 0 0 2px black;
      text-align: center;
      font-size: 75px;
      color: #1a32a9;
      width: 380px;
      letter-spacing: 2px
    }
    @media (max-width: 321px) {
      .title {
      font-size: 35px;
      width: 320px;
      }
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("h1");
    text.classList.add("title");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("big-code", BigCode);
