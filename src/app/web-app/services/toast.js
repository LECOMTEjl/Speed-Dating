class Toast {
    listElement

    constructor() {
        var list = document.createElement('div')
        list.style.top = '0px'
        list.style.bottom = '0px'
        list.style.left = '0px'
        list.style.right = '0px'
        list.style.display = 'flex'
        list.style.flexDirection = 'column'
        list.style.position = 'absolute'
        list.style.width = '100%'
        list.style.height = '100%'
        list.style.pointerEvents = 'none'
        
        document.body.appendChild(list)
        this.listElement = list
    }

    create(msg = 'No msg', time = 5000, isError = false) {
        var toast = document.createElement('div')
        toast.style.margin = '20px 20px 20px auto'
        toast.style.borderRadius = '5px'
        toast.style.height = 'fit-content'
        toast.style.background = isError ? 'red' : 'white'
        toast.style.boxShadow = '0px 0px 5px black'

        var msgElement = document.createElement('p')
        msgElement.style.margin = '10px'
        msgElement.style.color = isError ? 'white' : 'black'
        msgElement.textContent = msg
        
        toast.appendChild(msgElement)
        
        this.listElement.appendChild(toast)

        setTimeout(this.destroy.bind(this, toast), time)
    }

    destroy(toast) {
        toast.remove()
    }
}

window['toast'] = new Toast()