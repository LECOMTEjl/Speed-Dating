class ModalDialog extends HTMLElement {

    attributes = {
        show : false
    }

    styleCss = `
        .modal-dialog-background {
            background-color: rgba(0, 0, 0, 0.9);
            pointer-events: all;
            position: absolute;
            top:0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1050;
            overflow: hidden;
            outline: 0;
            opacity: 1;
            display: flex;
        }

        .modal-dialog-background .modal-dialog {
            margin:auto !important;
            transition: transform .3s ease-out,-webkit-transform .3s ease-out;
            background: rgba(255, 255, 255, 0.5);
            box-shadow: -1px -1px 0px rgb(255 255 255 / 50%), 1px 1px 0px rgb(0 0 0 / 50%);
            border-radius: 30px;
            color: #ffffff;
        }

        .modal-header {
            border-bottom: 1px solid #e9ecef;
        }

        .modal-content {
            padding: 40px;
        }

        .modal-header, 
        .modal-footer {
            display:flex;
            padding: 20px;
        }

        .modal-header * {
            margin:auto;
        }

        .modal-footer {
            border-top: 1px solid #e9ecef;
        }

        .modal-footer * {
            margin: 0 20px;
            flex:1;
            color:#ffffff;
        }

        .modal-footer .btn-cancel {
            background-color: #6c757d;
        }

        .modal-footer .btn-valid {
            background-color: #007bff;
        }
    `

    constructor() {
        super()
    }

    connectedCallback() {
        if(!document.getElementById("dialog-style"))
            document.head.innerHTML += `<style id="dialog-style">${this.styleCss}</style>`

        this.classList.add('modal-dialog-background')

        this.onclick = ev => {
            var target = ev.target
            if(this != target) return
            this.closeDialog()
        }

        if(this.hasAttribute('show'))
            this.attributes.show = this.getAttribute('show')

        this.update()
    }

    disconnectedCallback() {
        document.getElementById("dialog-style")?.remove()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(newValue == undefined)
            return this.setAttribute(name, oldValue)
        
        this.attributes[name] = newValue

        this.update()
    }

    static get observedAttributes() {
        return [
            "show"
        ];
    }

    openDialog() {
        this.attributes.show = true
        this.update()
    }

    closeDialog() {
        this.attributes.show = false
        this.update()
    }

    update() {
        this.style.display = this.attributes.show ? 'flex' : 'none'
    }
}

customElements.define('modal-dialog', ModalDialog)