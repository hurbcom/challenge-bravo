const cluster = require("cluster");

if (cluster.isMaster) {
    // Utilização de cluster para melhor aproveitamento de CPU e desempenho
    const cpus = require("os").cpus().length;

    for (let i = 0; i < cpus; i++) cluster.fork();
    cluster.on("exit", worker => cluster.fork());
} else {
    const express = require("express");
    const consign = require("consign");

    const app = express();
    const APP_PORT = process.env.PORT || 3000;

    // Pré carregamento dos arquivos
    consign({
        cwd: process.cwd(),
        locale: "pt-br",
        logger: console,
        verbose: false,
        extensions: [".js", ".json", ".node"],
        loggingType: "info"
    })
        .include("./src/middlewares")
        .include('./src/cache')
        .include("./src/models")
        .then("./src/controllers")
        .then("./src/routes")
        .into(app);

    // Somente um endpoint para verificação
    app.get("/", (request, response) => {
        response.send({ message: "It's working" });
    });

    app.listen(APP_PORT, () =>
        console.log(`SERVER RUNNING IN PORT ${APP_PORT}`)
    );
}