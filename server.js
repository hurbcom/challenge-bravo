const app = require('./app');

// Server
const port = 8000;
app.listen(port, () => {
    console.log('Servidor em execução na porta: ' + port);
});