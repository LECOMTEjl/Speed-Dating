class Login {

    login() {
        let email = document.getElementById('Email').value
        let password = document.getElementById('Password').value
        http.url('login').method('POST').body({ email, password }).send()
        .then(res => token.set(res.token) )
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
            document.getElementById('Login').disabled = false
        else
            document.getElementById('Login').disabled = true
    }
}

window['login'] = new Login()