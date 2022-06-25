import express from "express";
import currency from "./currency.js";
import exchange from "./exchange.js";

const routes = (app) => {

    app.use(
        express.json(),
        currency,
        exchange
    )

    app.route('/ping').get((req, res) => {
        res.status(200).send({message: "server working perfectly"})
    })
    
    //  ERROR HANDLER...
    app.use((req,res,next) => {
        const erro = new Error('URL NOT FOUND, TRY localhost:4040/ping');
        erro.status = 404;
        next(erro);
    });
    
    app.use((req,res,next) => {
        res.status(error.status || 500);
        return res.send({
            erro: {
                mensagem: error.message
            }
        });
    });

}

export default routes;