const TOKEN = 'token'

class Token {
    get() { return localStorage.getItem(TOKEN) }
    set(token) { localStorage.setItem(TOKEN, token)}
    remove() {
        localStorage.removeItem(TOKEN)
        redirect.to('login')
    }
    exist() { return (this.get() ? true : false) }
}

window['token'] = new Token