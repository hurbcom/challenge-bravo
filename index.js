const app = require('./config/express')();
app.listen(3000, () => console.log('Servidor de conversão de moedas rodando na porta 3000.'));
