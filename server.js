const app = require('./app');

const port = process.env.NODE_LOCAL_PORT || 8080;

if (require.main === module){
    //inicia o servidor
    app.listen(port);
}
