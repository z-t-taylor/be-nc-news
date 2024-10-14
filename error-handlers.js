exports.error404 = (err, request, response, next) => {
    if (err.status === 404 && err.msg) {
        response.status(404).send({ msg: err.msg })
    }
    next(err)
}

exports.error400 = (err, request, response, next) => {
    if (err.code === '22P02'){
        response.status(400).send({ msg: "Invalid Data Type" })
    }
    next(err)
}

exports.error500 = (err, request, response, next) => {
    response.status(500).send({ msg: "Internal Server Error"});
}
