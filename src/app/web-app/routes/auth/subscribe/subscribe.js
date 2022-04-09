class Subscribe {

    subscribe() {
        var email         = document.getElementById('Email').value
        var pseudo        = document.getElementById('Pseudo').value
        var password      = document.getElementById('Password').value
        var validPassword = document.getElementById('ValidPassword').value

        if(password != validPassword)
            throw new Error('Not same password')

        http.url('subscribe').method('POST').body({ email, pseudo, password }).send()
        .then(res => redirect.to('login') )
        .catch((err) => {
            if(err.status == 400)
                this.setSubscribeErrorMsg('Veuillez revérifier les champs.')
            else if(err.status == 409)
            this.setSubscribeErrorMsg('Vous avez déja un compte.')
            else
                this.setSubscribeErrorMsg('Erreur serveur')
        })

        
    }

    setInvalidMsg(el, extra) {
        var hint = el.parentElement.getElementsByClassName('hint')?.item(0)
        if(!hint) return

        if(el.checkValidity()) {
            hint.innerText = ''
            hint.classList.remove('show-hint')
        }
        else {
            var msg = "Ce champs n'est pas conforme." + (extra ? ' ' + extra : '')
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
        var password = document.getElementById('Password').value
        if(el.value != password) {
            el.setCustomValidity('Password Must be Matching.')
            this.setInvalidMsg(el, 'Les mots de passes ne sont pas égaux.')
        }
        else {
            el.setCustomValidity('')
            this.setInvalidMsg(el, extra)
        }
    }

    setSubscribeErrorMsg(msg) {
        toast.create(msg, undefined, true)
    }

}

window['subscribe'] = new Subscribe()