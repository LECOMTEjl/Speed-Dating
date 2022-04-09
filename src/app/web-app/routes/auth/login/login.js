class Login {

    login() {
        var email = document.getElementById('Email').value
        var password = document.getElementById('Password').value
        http.url('login').method('POST').body({ email, password }).send()
        .then(res => token.set(res.token) )
        .catch((err) => {
            if(err.status == 400 || err.status == 401)
                this.setLoginErrorMsg('Veuillez revérifier votre adresse email ou votre mot de passe.')
            else if(err.status == 404)
                this.setLoginErrorMsg('Serveur injoignable.')
            else
                this.setLoginErrorMsg('Erreur serveur')
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
            document.getElementById('Login').disabled = false
        else
            document.getElementById('Login').disabled = true
    }

    setLoginErrorMsg(msg) {
        toast.create(msg, undefined, true)
    }

}

window['login'] = new Login()