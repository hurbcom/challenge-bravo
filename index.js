require('dotenv/config');
const createServer = require('./src/app');

const app = createServer();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (!error) {
    // eslint-disable-next-line no-console
        console.log(`Server is listening on port ${PORT}`);
    } else {
    // eslint-disable-next-line no-console
        console.log('Error occured, server can\'t start', error);
    }
});
