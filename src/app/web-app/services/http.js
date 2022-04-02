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
        this._headers = headers
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

        return fetch(url, fetchInit)
        .then(res => {
            if(token.exist() && res.status == 401)
                token.remove()

            if(res.status == 200)
                return res.json()
            else
                return res.text()
        })
    }
}

window['http'] = new Http