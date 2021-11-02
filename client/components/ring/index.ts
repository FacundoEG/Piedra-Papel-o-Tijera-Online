class ProgressRing extends HTMLElement {
  _circumference:any
  root:ShadowRoot
  contador:any
  constructor() {
    super();
    const stroke:any = this.getAttribute('stroke');
    const radius:any = this.getAttribute('radius');
    this.className = "progress-ring"
    let contador = this.getAttribute("contador")
    const normalizedRadius = radius - stroke * 2;
    this._circumference = normalizedRadius * 2 * Math.PI;

    this.root = this.attachShadow({mode: 'open'});
    const div = document.createElement("div")

    div.innerHTML = `
      <svg
        height="${radius * 2}"
        width="${radius * 2}"
       >
        <text x="120" y="180"
        font-weight="600"
        font-family="Zilla Slab"
        font-size="110">
        ${contador}
  </text>

      <circle
           stroke="black"
           stroke-dasharray="${this._circumference} ${this._circumference}"
           style="stroke-dashoffset:${this._circumference}"
           stroke-width="${stroke}"
           fill="transparent"
           r="${normalizedRadius}"
           cx="${radius}"
           cy="${radius}"
        />
      </svg>

      <style>
        circle {
          backgrund: none;
          transition: stroke-dashoffset 0.35s;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          overflow: auto:
        }
      </style>
    `;
    this.root.appendChild(div)
  }
  
  setProgress(percent) {
    const offset = this._circumference - (percent / 100 * this._circumference);
    const circle = this.root.querySelector('circle');
    circle.style.strokeDashoffset = `${offset}`; 
  }

  static get observedAttributes() {
    return ['progress'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'progress') {
      this.setProgress(newValue);
    }
  }
}

window.customElements.define('progress-ring', ProgressRing);
