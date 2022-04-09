class Http {
    baseUrl = environment.apiUrl
    _url = undefined
    _method = undefined
    _headers = undefined
    _body = undefined

    url(url) {
        this._url = url
        return this
    }

    method(method) {
        this._method = method
        return this
    }

    headers(headers) {
        this._headers = Object.assign(headers, this._headers)
        return this
    }

    authorization(token) {
        if(!token)
            token = window['token'].get()
        
        this._headers = Object.assign({Authorization : 'Bearer ' + token}, this._headers)
        return this
    }
    
    body(body) {
        this._body = body
        return this
    }

    async send() {
        if(!this.baseUrl)
            throw new Error('Missing baseUrl')

        var url = this.baseUrl + this._url

        var fetchInit = {
            method: this._method || 'GET',
            headers: Object.assign(this._headers || {}, {'Content-Type': 'application/json'}),
            mode: 'cors',
            cache: 'no-cache',
            body: JSON.stringify(this._body)
        }

        this._url = undefined
        this._method = undefined
        this._headers = undefined
        this._body = undefined

        console.log(
            url,
            fetchInit.method,
            fetchInit.headers,
            fetchInit.body
            )

        return fetch(url, fetchInit)
        .then(res => {
            if(token.exist() && res.status == 401)
                token.remove()

            if(res.status >= 200 && res.status < 300) {
                return res.json().then(msg => {
                    return msg
                })
                .catch(err => {
                    throw {status: res.status, msg: err}
                })
            }
            else
                return res.text().then(msg => {
                    throw {status: res.status, msg: msg}
                })
        })
    }
}

window['http'] = new Http