import express from 'express';

const app = express();

app.get('/', (req, res) => {
  return res.send('Hello, Hurb!');
});

export { app };
