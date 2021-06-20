const routesImport = require('./api/server/router');

routesImport();

const { app } = require('./api/server/server');
const port = 3000;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
