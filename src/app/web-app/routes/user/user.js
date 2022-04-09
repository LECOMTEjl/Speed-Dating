class User {
    currUser
    user

    meets

    constructor() {
        var url = window.location.href
        var id = +url.split('/')[url.split('/').length-1]
        
        this.getCurrUser()
        this.getUser(id)
        this.getMeets(id)
    }
    
    getCurrUser() {
        http.url('users').method('GET').authorization().send()
        .then(res => this.currUser = res)
        .catch((err) => console.log('Error', err) )
    }

    getUser(id) {
        http.url('users' + '/' + id).method('GET').authorization().send()
        .then(res => {
            this.user = res
            this.setUserInfo()
        } )
        .catch((err) => console.log('Error', err) )
    }

    getMeets(id) {
        http.url('meets' + '?userId=' + id).method('GET').authorization().send()
        .then(res => {
            this.meets = res
            this.setMeets()
        } )
        .catch((err) => console.log('Error', err) )
    }

    setUserInfo() {
        var header = document.getElementById('header')
        var birthday = new Date(this.user.birthday)
        var stringDate = `${birthday.getDate().toString().padStart(2, '0')}/${(birthday.getMonth()+1).toString().padStart(2, '0')}/${birthday.getFullYear().toString().padStart(4, '0')}`
        header.innerHTML = `
            <div class="img"></div>
            <h1>${this.user.firstName} ${this.user.lastName}</h1>
            <h2>${this.user.gender == 'f' ? 'Femme' : 'Homme'}</h2>
            <h2>${stringDate}</h2>
            <h2>${this.user.note != null ? this.user.note + ' / 10' : 'Pas encore de note'}</h2>
        `
    }

    setMeets() {
        console.log(this.meets)
        var body = document.getElementById('body')
        body.innerHTML = ''
        this.meets.forEach(el => {
            var date = new Date(el.date)
            var stringDate = date.getDay().toString().padStart(2, '0') + '/' + date.getMonth().toString().padStart(2, '0') + '/' + date.getFullYear().toString().padStart(4, '0') + ' à ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')

            body.innerHTML += `
                <tr id="${el.id}">
                    <td>${stringDate}</td>
                    <td>${el.note    ? el.note + ' / 10' : ''}</td>
                    <td>${el.comment ? el.comment        : ''}</td>
                    <td><button onclick="user.generateDialog(${el.id})">Modifier</button></td>
                    <td><button onclick="user.deleteMeet(${el.id})">Supprimer</button></td>
                </tr>
            `
        })
    }

    deleteMeet(id) {
        http.url('meets' + '/' + id).method('DELETE').authorization().send()
        .then(res => {
            this.getMeets(this.user.id)
            console.log(res)
        })
        .catch(err => toast.create('Erreur Serveur', undefined, true))
    }

    generateDialog(id) {
        if(id)
            var meet = this.meets.find(el => el.id == id)

        var title = document.getElementById('modalLabel')
        var validModal = document.getElementById('validModal')

        var datetime = document.getElementById('datetime')
        var note = document.getElementById('note')
        var comment = document.getElementById('comment')

        if(!meet) {
            title.innerText = 'Créer une rencontre'
            datetime.value = ''
            note.value = ''
            comment.value = ''

            validModal.addEventListener('click', (event) => {
                var body = {
                    userId: this.user.id,
                    date: new Date(datetime.value).toISOString() || null,
                    note: note.value || null,
                    comment: comment.value || null
                }
                http.url('meets').method('POST').body(body).authorization().send()
                .then(res => {
                    this.getMeets(this.user.id)
                    this.hideDialog()
                })
                .catch(err => console.log(err))
            })
        }
        else {
            title.innerText = 'Modifier une rencontre'

            var split = meet.date.split(':')

            datetime.value = split[0] + ':' + split[1]
            note.value = meet.note
            comment.value = meet.comment

            validModal.addEventListener('click', (event) => {
                var body = {
                    userId: this.user.id,
                    date: new Date(datetime.value).toISOString() || null,
                    note: note.value || null,
                    comment: comment.value || null
                }
                http.url('meets' + '/' + meet.id).method('PUT').body(body).authorization().send()
                .then(res => {
                    this.getMeets(this.user.id)
                    this.hideDialog()
                })
                .catch(err => console.log(err))
            })
        }

        this.showDialog()
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

window['user'] = new User()