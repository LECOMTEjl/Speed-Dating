class Toast extends HTMLElement {

    styleCss = `
        .toast-background {
            top:0px;
            bottom:0px;
            left:0px;
            right:0px;
            display:flex;
            flexDirection:column;
            position:absolute;
            width:100%;
            height:100%;
            pointerEvents:none;
        }

        .toast {
            margin:20px 20px 20px auto;
            border-radius:5px;
            height:fit-content;
            background:white;
            box-shadow:0px 0px 5px black;
            font-size:50px;
            z-index:5;
        }

        .toast * {
            margin:10px;
            color:white;
        }
    `

    constructor() {
        super()
    }

    connectedCallback() {
        if(!document.getElementById("toast-style"))
            document.head.innerHTML += `<style id="toast-style">${this.styleCss}</style>`
        
        this.classList.add('toast-background')
    }

    disconnectedCallback() {
        document.getElementById("toast-style")?.remove()
    }


    create(msg = 'No msg', time = 5000, isError = false) {
        let toast = document.createElement('div')
        toast.classList.add('toast')
        toast.style.background = isError ? 'red' : 'white';

        let msgElement = document.createElement('p')
        msgElement.style.color = isError ? 'white' : 'black'
        msgElement.textContent = msg
        
        toast.appendChild(msgElement)
        this.appendChild(toast)

        setTimeout(this.destroy.bind(this, toast), time)
    }

    destroy(toast) {
        toast.remove()
    }
}

customElements.define('my-toast', Toast)