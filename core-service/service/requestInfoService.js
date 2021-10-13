//Service to get req params
module.exports = function requestInfoService(req){
    return {
        from: req.query.from,
        to: req.query.to,
        amount: req.query.amount
    }
}
