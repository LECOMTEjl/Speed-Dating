class HttpError extends Error {
    constructor(code, msg) {
        this.code = code
        this.message = msg
    }
    code
}

module.exports = HttpError