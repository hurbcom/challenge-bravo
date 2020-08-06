import express, { request, response } from 'express';

const app = express();

app.get('/', (request, response) => {
    return response.json({messagem:'Hello, Hurb! This is just a test to see if the Typescript config is ok (:'});
});

app.listen(3333, () => {
    console.log('Server started at port 3333');
});