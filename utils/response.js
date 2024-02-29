exports.Response = (res, statusCode, data = null, cors = true) => {
    if(cors)
        res.set('Access-Control-Allow-Origin', '*');

    if(!data) res.status(statusCode).send();
    else res.status(statusCode).send(data);
};