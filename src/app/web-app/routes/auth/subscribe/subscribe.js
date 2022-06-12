class Subscribe {

    subscribe() {
        let email         = document.getElementById('Email').value
        let pseudo        = document.getElementById('Pseudo').value
        let password      = document.getElementById('Password').value
        let validPassword = document.getElementById('ValidPassword').value

        if(password != validPassword)
            throw new Error('Not same password')

        http.url('subscribe').method('POST').body({ email, pseudo, password }).send()
        .then(res => redirect.to('login') )
        .catch((err) => console.log(err) )
    }

    setInvalidMsg(el, extra) {
        touchedFunction(el)
        let hint = el.parentElement.getElementsByClassName('hint')?.item(0)
        if(!hint) return

        if(el.checkValidity()) {
            hint.innerText = ''
            hint.classList.remove('show-hint')
        }
        else {
            let msg = "Ce champs n'est pas conforme." + (extra ? ' ' + extra : '')
            if(el.value == null)
                msg = "Ce champs ne doit pas être vide."
            hint.innerText = msg
            hint.classList.add('show-hint')
        }

        if(document.getElementById('container').checkValidity())
            document.getElementById('Subscribe').disabled = false
        else
            document.getElementById('Subscribe').disabled = true
    }

    checkIfIsSamePassword(el, extra) {
        let password = document.getElementById('Password').value
        if(el.value != password) {
            el.setCustomValidity('Password Must be Matching.')
            this.setInvalidMsg(el, 'Les mots de passes ne sont pas égaux.')
        }
        else {
            el.setCustomValidity('')
            this.setInvalidMsg(el, extra)
        }
    }
}

window['subscribe'] = new Subscribe()