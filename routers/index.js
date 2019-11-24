module.exports = (app) => {


    app.get('/exchange', async (req, res, next) => {
        
        try{
            const exchange = new app.services.exchange(app)
            let result = exchange.convert(req.query)
            res.send({result})
        }catch(error){
            res.status(400).send({message:error})
        }
    })

    app.delete('/exchange/:moeda', async (req, res, next) => {
        
        try{
            const exchange = new app.services.exchange(app)
            let result = exchange.delete(req.params.moeda)
            res.sendStatus(204)
        }catch(error){
            res.status(400).send({message:error})
        }
    })
}
