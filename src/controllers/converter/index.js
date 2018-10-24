const controller = {}

controller.convert = (req, res) => {
    console.log("Vai converter aqui.")
    res.send({data : "res"})
    // let [err, resp] = await to(service.interval(req.query))

    // if (err) {
    //     console.log('Erro ao calcular intervalado:', err)
    //     return res.send({ error: true })
    // }

    // res.send(resp)
}

module.exports = controller