class Subscribe {

    subcribe() {
        var firstName     = document.getElementById('FirstName').value
        var lastName      = document.getElementById('LastName').value
        var birthday      = document.getElementById('Birthday').value
        var gender        = document.getElementById('Gender').value == 'Man' ? 'm' : 'f'
        var email         = document.getElementById('Email').value
        var pseudo        = document.getElementById('Pseudo').value
        var password      = document.getElementById('Password').value
        var validPassword = document.getElementById('ValidPassword').value

        if(password != validPassword)
            throw new Error('Not same password')

        http.url('subscribe').method('POST').body({ firstName, lastName, birthday, gender, email, pseudo, password }).send()
        .then(res => {
            token.set(res.token)
            redirect.to()
        })
        .catch((err) => console.log(err))
    }

}

window['subscribe'] = new Subscribe()