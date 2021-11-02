 class MenuButton extends HTMLElement {
  constructor() {
    super();
    this.render()
  }
  render(){
    var style = document.createElement("style")
    style.textContent = `
    .button{
      background-color: #006CFC;
      border: 10px solid #001997;
      box-sizing: border-box;
      border-radius: 15px;
      height: 80px;
      width: 310px;
      font-family: Odibee Sans;
      font-size: 45px;
      line-height: 50px;
      color: #D8FCFC;
      cursor: pointer;
      letter-spacing: 1px;
    }

    .button:active{
      background-color: #001997;
      border: 10px solid #006CFC;
      color: white
    }
    
   @media (min-width: 750px){
     .button{
       width: 340px;
     }
   }
    `
    var shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(style)

    var menuButton = document.createElement("button")
    menuButton.classList.add("button")
    menuButton.textContent = this.textContent
  
    shadow.appendChild(menuButton)
  }
}
customElements.define('menu-button', MenuButton);