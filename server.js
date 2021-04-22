const app = require('./app');
const sync = require('./sync/updateCurrenciesValue');

// Atualização da taxa de câmbio de 1 em 1 hora
setInterval(() => {
    console.log('Sincronizando moedas...');
    sync.syncCurrencies(async () => {
        console.log('Moedas sincronizadas!');
    });
}, 3600000);

// Server
const port = 8000;
app.listen(port, () => {
    console.log('Servidor em execução na porta: ' + port);
});