import express from 'express';

const server = express();

server.get('/', (_, res) => {
    res.send('Server online');
});

server.listen(3000, () => {
    console.log('Server running');
});