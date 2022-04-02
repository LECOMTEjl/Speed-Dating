class Login {

    login() {
        var email = document.getElementById('Email').value
        var password = document.getElementById('Password').value
        http.url('login').method('POST').body({ email, password }).send()
        .then(res => {
            console.log(res)
            token.set(res.token)
            redirect.to()
        })
        .catch((err) => console.log('Error', err))
    }

}

window['login'] = new Login()