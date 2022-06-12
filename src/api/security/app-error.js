class AppError {
    error
    constructor(error) {
        let { status, msg, details } = error
        if(status == undefined || msg == undefined)
            throw "AppError constructor require status and msg parametters"
        this.error = error
    }
    
    sendError(res, appError) {
        if(res == undefined || appError == undefined)
            throw "AppError.sendError require res and appError parametters"
        res.status(appError.error.status).send({ msg:appError.error.msg, details:appError.error.details })
    }
}

exports = AppError