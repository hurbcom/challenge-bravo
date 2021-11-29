const app = require('./Middleware/app');

const PORT = 3030;
const HOST = "0.0.0.0";

app.listen(PORT,HOST, () => {
  console.log(`Porta: ${PORT} - Host: ${HOST}`);
})
