class Main {
    currUser
    listUsers

    constructor() {
        if(!token.exist()) redirect.to('login')

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
        .catch((err) => {
            console.log(err)
        } )
    }

    async getList() {
        return new Promise((resolve, reject) => {
            http.url('users').method('GET').authorization().send()
            .then(async res => {
                await this.setList(res)
                resolve(undefined)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            } )
        })
        
    }

    async setList(list) {
        this.listUsers = list
        let swiper = document.getElementById('swiper')
        let listEl = swiper.getElementsByClassName('swiper-wrapper')?.item(0)
        if(!listEl) return
        
        listEl.innerHTML = ''
        for(let el of list) {
            listEl.innerHTML += `
            <div class="swiper-slide" id="${el.id}">
                <div class="swiper-body" onclick="main.generateDialogUser(${el.id}, '${el.firstName}', '${el.lastName}', '${el.gender}', '${el.birthday}')">
                    <div id="image_${el.id}" class="img"></div>
                    <label>${el.firstName} ${el.lastName}</label>
                    <label>${el.gender == 'm' ? 'Homme' : 'Femme' }</label>
                    <label>${utils.age(el.birthday)} ans</label>
                </div>

                <div class="swiper-meets">
                    <p>Rencontres</p>
                    <div class="meets-list">
                        <!-- Wait Api Response -->
                    </div>
                    <button id="add-meet" onclick="main.generateDialogMeet(undefined, ${el.id})">+</button>
                </div>
                
                <div class="space"></div>
                <div class="swiper-footer">
                    <button class="modify" onclick="main.generateDialogUser(${el.id}, '${el.firstName}', '${el.lastName}', '${el.gender}', '${el.birthday}')">Modifier</button>
                    <button class="delete" onclick="main.deleteUser(${el.id})">Supprimer</button>
                </div>
            </div>
            `
            await this.getMeets(el.id)
        }
        swiper.init()
        this.updateImages()
    }

    async getMeets(userId) {
        return new Promise((resolve, reject) => {
            http.url('meets' + '?userId=' + userId).method('GET').authorization().send()
            .then(res => {
                this.setMeets(userId, res)
                resolve(undefined)
            } )
            .catch((err) => reject(err) )
        })
        
    }

    setMeets(userId, meets) {
        console.log(meets)
        let div = document.getElementById(userId)
        let list = div.getElementsByClassName('meets-list').item(0)
        list.innerHTML = ''
        meets.forEach(el => {
            list.innerHTML += `
            <div class="meets-item">
                <div onclick="main.generateDialogMeet(${el.id}, ${el.userId}, '${el.date}', '${el.comment}', ${el.note})">
                    <p>${el.date}</p>
                    <p>${el.note ? el.note + ' / 10' : ''}</p>
                    <p>${el.comment}</p>
                </div>
                <button onclick="main.deleteMeet(${el.id}, ${el.userId})">Supprimer</button>
            </div>
            `
        })
    }

    deleteUser(id) {
        http.url('meets' + '/' + id).method('DELETE').authorization().send()
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    updateImages() {
        this.listUsers.forEach(el => {
            let img = document.getElementById('image_' + el.id)
            if(!img) return
            img.style.backgroundImage = this.getImage(el.id)
        })
    }

    async generateDialogUser(id, firstName, lastName, gender, birthday) {
        let user = undefined
        
        if(id)
            user = {id, firstName, lastName, gender, birthday}

        let title = document.getElementById('modalLabel')
        let validModal = document.getElementById('validUserModal')

        let elements = {
            firstName:document.getElementById('firstName'),
            lastName:document.getElementById('lastName'),
            gender:document.getElementById('gender'),
            birthday:document.getElementById('birthday'),
            img:document.getElementById('img')
        }

        if(!user) {
            title.innerText = 'Créer un utilisateur'
            elements.firstName.value = ''
            elements.lastName.value = ''
            elements.gender.value = ''
            elements.birthday.value = ''
            elements.img.value = ''
            await this.setDialogImage(undefined, elements.img)

            validModal.onclick = (event) => {
                validModal.innerHTML = `<cloud-loader></cloud-loader>`
                let body = {
                    firstName: elements.firstName.value,
                    lastName: elements.lastName.value,
                    gender: elements.gender.value,
                    birthday: new Date(elements.birthday.value).toISOString()
                } || undefined
                http.url('users').method('POST').body(body).authorization().send()
                .then(async res => {
                    if(elements.img.files)
                        await this.sendImage(elements.img, res.id)
                    await this.getList()
                    await this.setDialogImage(undefined, elements.img)
                    document.getElementById('swiper').swipe()
                    validModal.innerHTML = `Valider`
                    this.hideDialogUser()
                })
                .catch(err => {
                    console.log(err)
                    validModal.innerHTML = `Valider`
                    document.getElementById('swiper').swipe()
                })
            }
        }
        else {
            title.innerText = 'Modifier un utilisateur'
            elements.firstName.value = user.firstName
            elements.lastName.value = user.lastName
            elements.gender.value = user.gender
            elements.birthday.value = user.birthday.split('T')[0]
            elements.img.value = ''
            await this.setDialogImage(user.id, elements.img)

            validModal.onclick = (event) => {
                validModal.innerHTML = `<cloud-loader></cloud-loader>`
                let body = {
                    firstName: elements.firstName.value,
                    lastName: elements.lastName.value,
                    gender: elements.gender.value,
                    birthday: new Date(elements.birthday.value).toISOString()
                } || undefined
                http.url('users' + '/' + user.id).method('PUT').body(body).authorization().send()
                .then(async res => {
                    if(elements.img.files)
                        await this.sendImage(elements.img, user.id)
                    await this.getList()
                    await this.setDialogImage(user.id, elements.img)
                    document.getElementById('swiper').swipe()
                    validModal.innerHTML = `Valider`
                    this.hideDialogUser()
                })
                .catch(err => {
                    console.log(err)
                    validModal.innerHTML = `Valider`
                    document.getElementById('swiper').swipe()
                })
            }
        }

        this.showDialogUser()
    }

    async generateDialogMeet(id, userId, date, comment, note) {
        let meet = undefined
        
        if(id)
            meet = {id, userId, date, comment, note}

        let title = document.getElementById('modalLabel')
        let validModal = document.getElementById('validMeetModal')

        let elements = {
            date:document.getElementById('date'),
            comment:document.getElementById('comment'),
            note:document.getElementById('note')
        }

        if(!meet) {
            title.innerText = 'Créer une rencontre'
            elements.date.value = ''
            elements.comment.value = ''
            elements.note.value = ''

            validModal.onclick = (event) => {
                validModal.innerHTML = `<cloud-loader></cloud-loader>`
                let body = {
                    userId,
                    date: elements.date.value,
                    comment: elements.comment.value,
                    note: elements.note.value,
                }

                http.url('meets').method('POST').body(body).authorization().send()
                .then(async res => {
                    this.getMeets(userId)
                    this.hideDialogMeet()
                })
                .catch(err => {
                    console.log(err)
                    this.getMeets(userId)
                    this.hideDialogMeet()
                })
            }
        }
        else {
            title.innerText = 'Modifier une rencontre'
            elements.date.value = meet.date
            elements.comment.value = meet.comment
            elements.note.value = meet.note

            validModal.onclick = (event) => {
                validModal.innerHTML = `<cloud-loader></cloud-loader>`
                let body = {
                    userId,
                    date: elements.date.value,
                    comment: elements.comment.value,
                    note: elements.note.value,
                } || null
                http.url('meets' + '/' + meet.id).method('PUT').body(body).authorization().send()
                .then(async res => {
                    this.getMeets(userId)
                    this.hideDialogMeet()
                })
                .catch(err => {
                    console.log(err)
                    this.getMeets(userId)
                    this.hideDialogMeet()
                })
            }
        }

        this.showDialogMeet()
    }

    deleteUser(id) {
        http.url('users' + '/' + id).method('DELETE').authorization().send()
        .then(res => this.getList())
        .catch(err => console.log(err))
    }

    deleteMeet(id, userId) {
        http.url('meets' + '/' + id).method('DELETE').authorization().send()
        .then(res => this.getMeets(userId))
        .catch(err => console.log(err))
    }

    showDialogUser() {
        this.showDialog(document.getElementById('dialog-user'))
        this.checkUserValidity()
    }

    showDialogMeet() {
        this.showDialog(document.getElementById('dialog-meet'))
        this.checkMeetValidity()
    }

    showDialog(dialog) {
        dialog?.openDialog()
    }

    hideDialogUser() {
        this.hideDialog(document.getElementById('dialog-user'))
    }

    hideDialogMeet() {
        this.hideDialog(document.getElementById('dialog-meet'))
    }

    hideDialog(dialog) {
        dialog?.closeDialog()
    }

    setInvalidMsg(el, extra) {
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

        this.checkUserValidity()
        this.checkMeetValidity()
    }

    checkUserValidity() {
        if(document.getElementById('formUser')?.checkValidity())
            document.getElementById('validUserModal').disabled = false
        else
            document.getElementById('validUserModal').disabled = true
    }

    checkMeetValidity() {
        if(document.getElementById('formMeet')?.checkValidity())
            document.getElementById('validMeetModal').disabled = false
        else
            document.getElementById('validMeetModal').disabled = true
    }

    async sendImage(img, userId) {
        const file = img.files?.[0]
        if(!file) return
        
        await fileSender('users' + '/' + userId +  '/img', file)
    }

    async setInvalidMsgImage(el) {
        let hint = el.parentElement.parentElement.getElementsByClassName('hint')?.item(0)
        if(!hint) return
        
        if(this.checkImageExtention(el)) {
            hint.innerText = ''
            hint.classList.remove('show-hint')
            await this.setDialogImage(user.id, el)
        }
        else {
            el.value = ''
            let msg = "Ce champs n'est pas conforme. Les extentions d'images autorisées sont : png, jfif, pjpeg, jpeg, pjp, jpg, gif"
            hint.innerText = msg
            hint.classList.add('show-hint')
        }

        this.checkValidity()
    }

    checkImageExtention(img) {
        const file = img.files?.[0]
        if(!file) return true
        let validExtentions = ['png', 'jfif', 'pjpeg', 'jpeg', 'pjp', 'jpg', 'gif']
        let split = file.name.split('.')
        let extention = split[split.length - 1]
        if(!validExtentions.some(e => e.match(new RegExp(extention, 'i'))))
            return false
        return true
    }

    async setDialogImage(userId, img) {
        if(userId == undefined) {
            img.parentElement.style.backgroundImage = 'none'
        }
        else
            img.parentElement.style.backgroundImage = await this.getDialogImage(userId, img)
    }

    async getDialogImage(userId, img) {
        return new Promise((resolve, reject) => {
            let file = img.files?.[0]
            if(!file)
                return resolve(this.getImage(userId))
            else {
                let fr = new FileReader()

                let base64 = ''
                fr.onload = (ev) => {
                    const CHUNK_SIZE = 100000
                    const CHUNK_COUNT = ev.target.result.length/CHUNK_SIZE
                
                    for(let chunkIndex = 0; chunkIndex < CHUNK_COUNT; chunkIndex++) {
                        let CHUNK_START = chunkIndex * CHUNK_SIZE
                        let CHUNK_END = CHUNK_START + CHUNK_SIZE
                        let CHUNK = ev.target.result.slice(CHUNK_START, CHUNK_END)
                        base64 += CHUNK
                    }
                    return resolve(`url(${base64})`)
                }

                fr.readAsDataURL(file)
            }
        })
    }

    getImage(userId) {
        return `url(http://localhost:3000/app/assets/user/${userId}.png)`
    }
}

window['main'] = new Main()