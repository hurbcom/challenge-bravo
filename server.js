var app = require('./config/express')();

app.listen(3000, function () {
    console.log('Servidor de conversão de moedas rodando na porta 3000.');
});
