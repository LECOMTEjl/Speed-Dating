class CloudLoader extends HTMLElement {

    styleCss = `
        .fa-cloud-upload {
            animation-duration: 1.5s;
            animation-name: loader-load;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            font-size: 50px;
        }

        @keyframes loader-load {
            0% {
                opacity: 1;
            }

            50% {
                opacity: 0.5;
            }
        
            100% {
                opacity: 1;
            }
        }
    `

    constructor() {
        super()
    }

    connectedCallback() {
        if(!document.getElementById("loader-font-awesome-style"))
            document.head.innerHTML += `<link id="loader-font-awesome-style" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">`
        if(!document.getElementById("loader-style"))
            document.head.innerHTML += `<style id="loader-style">${this.styleCss}</style>`

        this.innerHTML = `<i class='fa fa-cloud-upload'></i>`
    }

    disconnectedCallback() {
        document.getElementById("loader-font-awesome-style")?.remove()
        document.getElementById("loader-style")?.remove()
    }
}


customElements.define('cloud-loader', CloudLoader)