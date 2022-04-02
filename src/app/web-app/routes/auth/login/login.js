class Login {

    login() {
        var email = document.getElementById('Email').value
        var password = document.getElementById('Password').value
        http.url('login').method('POST').body({ email, password }).send()
        .then(res => token.set(res.token) )
        .catch((err) => console.log(err) )
    }

}

window['login'] = new Login()