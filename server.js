const app = require('./config/express')();
const port = app.get('port');

//Inicialização do Servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});

module.exports = app;