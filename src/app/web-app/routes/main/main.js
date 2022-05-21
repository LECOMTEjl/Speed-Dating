class Main {
    currUser

    constructor() {
        if(!token.exist())
        redirect.to('login')

        this.getCurrUser()
        this.getList()
    }

    getCurrUser() {
        http.url('subscriber').method('GET').authorization().send()
        .then(res => {
            this.currUser = res
            document.getElementById('user').innerHTML = `
                <p>${res.pseudo}</p>
            `
        } )
        .catch((err) => toast.create('Erreur Serveur', undefined, true) )
    }

    getList() {
        http.url('users').method('GET').authorization().send()
        .then(res => this.setList(res) )
        .catch((err) => toast.create('Erreur Serveur', undefined, true) )
    }

    setList(list) {
        var listEl = document.getElementById('tbody')
        listEl.innerHTML = ''
        list.forEach(el => {
            listEl.innerHTML += `
                <tr id="${el.id}">
                    <td onclick="redirect.to('user/${el.id}')">${el.firstName} ${el.lastName}</td>
                    <td onclick="redirect.to('user/${el.id}')">${utils.age(el.birthday)} ans</td>
                    <td onclick="redirect.to('user/${el.id}')">${el.gender == 'm' ? 'Homme' : 'Femme'}</td>
                    <td onclick="redirect.to('user/${el.id}')">${el.note != null ? el.note + ' / 10' : ''}</td>
                    <td><button onclick="main.generateDialog(${el.id}, '${el.firstName}', '${el.lastName}', '${el.gender}', '${el.birthday}', ${el.note})">Modifier</button></td>
                    <td><button onclick="main.deleteUser(${el.id})">Supprimer</button></td>
                </tr>
            `
        })
    }

    deleteUser(id) {
        http.url('meets' + '/' + id).method('DELETE').authorization().send()
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    generateDialog(id, firstName, lastName, gender, birthday, note) {
        if(id)
            var user = {id, firstName, lastName, gender, birthday, note}

        var title = document.getElementById('modalLabel')
        var validModal = document.getElementById('validModal')

        var firstName = document.getElementById('firstName')
        var lastName = document.getElementById('lastName')
        var gender = document.getElementById('gender')
        var birthday = document.getElementById('birthday')
        var note = document.getElementById('note')

        if(!user) {
            title.innerText = 'Créer un utilisateur'
            firstName.value = ''
            lastName.value = ''
            gender.value = ''
            birthday.value = ''
            note.value = ''

            validModal.addEventListener('click', (event) => {
                var body = {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    gender: gender.value,
                    birthday: new Date(birthday.value).toISOString(),
                    note: note.value
                }
                http.url('users').method('POST').body(body).authorization().send()
                .then(res => {
                    this.getList()
                    this.hideDialog()
                })
                .catch(err => console.log(err))
            })
        }
        else {
            title.innerText = 'Modifier un utilisateur'
            firstName.value = user.firstName
            lastName.value = user.lastName
            gender.value = user.gender
            birthday.value = user.birthday.split('T')[0]
            note.value = user.note

            validModal.addEventListener('click', (event) => {
                var body = {
                    firstName: firstName.value || null,
                    lastName: lastName.value || null,
                    gender: gender.value || null,
                    birthday: new Date(birthday.value).toISOString() || null,
                    note: note.value 
                }|| null
                http.url('users' + '/' + user.id).method('PUT').body(body).authorization().send()
                .then(res => {
                    this.getList()
                    this.hideDialog()
                })
                .catch(err => console.log(err))
            })
        }

        this.showDialog()
    }

    deleteUser(id) {
        http.url('users' + '/' + id).method('DELETE').authorization().send()
                .then(res => this.getList())
                .catch(err => console.log(err))
    }

    showDialog() {
        var dialog = document.getElementById('modal')
        dialog.style.display = 'block'
        dialog.style.opacity = 1

        this.checkValidity()
    }

    hideDialog() {
        var dialog = document.getElementById('modal')
        dialog.style.display = 'none'
        dialog.style.opacity = 0
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

        this.checkValidity()
    }

    checkValidity() {
        if(document.getElementById('form').checkValidity())
            document.getElementById('validModal').disabled = false
        else
            document.getElementById('validModal').disabled = true
    }
}

window['main'] = new Main()